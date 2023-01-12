import ListEmpty from 'components/common/LisstEmpty'
import ScreenHeader from 'components/common/ScreenHeader'
import { useEffect, useState } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import { Text, View } from '../components/Themed'
import { FlashList } from '@shopify/flash-list'
import Relayer from 'service'
import { useAppSelector } from 'store/hooks'
import { decrypt } from 'nostr-tools/nip04'
import { Event } from 'nostr-tools'
import Toast from 'utils/toast'
import _ from 'lodash'
import Avatar from 'components/common/Avatar'
import Colors from 'theme/Colors'
import useColorScheme from 'hooks/useColorScheme'
import Fonts from 'theme/Fonts'
import { ellipsis } from 'utils'
import dayjs from 'dayjs'

async function parseMessage(note: Event, iprivkey: string, ipubkey: string) {
  let message = ''
  let _target = ''
  if (note.tags.find(([tag, value]) => tag === 'p' && value === ipubkey)) {
    message = await decrypt(iprivkey, ipubkey, note.content)
    _target = note.pubkey
  } else if (note.pubkey === ipubkey) {
    let result = note.tags.find(([tag]) => tag === 'p')
    if (result) {
      const [_, target] = result
      _target = target
      message = await decrypt(iprivkey, target, note.content)
    }
  }

  console.log('note', note)

  return {
    ...note,
    content: message,
    contact: _target,
  }
}

interface Contact {
  pubkey: string
  messages: Event[]
}

export default function Messages() {
  const [isLoading, setIsLoading] = useState(false)
  const { pubkey, privkey } = useAppSelector((state) => state.account)
  const [messages, setMessages] = useState<Contact[]>([])

  const profiles = useAppSelector((state) => state.profile)
  const theme = useColorScheme()
  const { width } = useWindowDimensions()

  const formatMessages = async (notes: Event[]) => {
    const result = await Promise.all(
      notes.map((note) => parseMessage(note, privkey, pubkey))
    )
    const sorted = _.groupBy(result, (note) => note.contact)
    setMessages(
      Object.keys(sorted).map((t) => {
        return {
          pubkey: t,
          messages: sorted[t],
        }
      })
    )
  }

  useEffect(() => {
    if (pubkey) {
      setTimeout(() => {
        const service = new Relayer()
        setIsLoading(true)
        service
          .getMessagesByPubkey(pubkey)
          .then((result) => {
            formatMessages(result)
            setIsLoading(false)
          })
          .catch((err) => {
            Toast.error(err)
            setIsLoading(false)
          })
      }, 5000)
    }
  }, [pubkey])
  return (
    <View style={styles.container}>
      <ScreenHeader title="Messages" isBackable={false} />
      <FlashList
        data={messages}
        estimatedItemSize={80}
        keyExtractor={(item) => item.pubkey}
        renderItem={({ item }) => {
          return (
            <View
              style={[
                styles.item,
                {
                  borderBottomColor: Colors[theme].borderColor,
                },
              ]}
            >
              <Avatar
                src={profiles[item.pubkey]?.picture || ''}
                pubkey={item.pubkey}
                size={50}
              />

              <View style={styles.right}>
                <Text style={styles.name}>
                  {profiles[item.pubkey]?.name ||
                    ellipsis(item.pubkey, 8, 8) ||
                    ''}
                </Text>
                {item.messages.length && (
                  <Text style={styles.timestamp}>
                    {dayjs(item.messages[0].created_at * 1000).fromNow()}
                  </Text>
                )}
                <Text
                  style={[styles.lastMessage, { maxWidth: width - 100 }]}
                  numberOfLines={1}
                >
                  {item.messages[0]?.content.trim()}
                </Text>
              </View>
            </View>
          )
        }}
        ListEmptyComponent={
          <ListEmpty isLoading={isLoading} title="No messages yet" />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {},
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: {
    fontFamily: Fonts.heading,
    fontSize: 20,
  },
  lastMessage: {
    fontSize: 18,
    color: Colors.gray9,
  },
  right: {
    paddingLeft: 10,
    flexDirection: 'column',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray9,
  },
})
