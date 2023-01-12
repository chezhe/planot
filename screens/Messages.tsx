import ListEmpty from 'components/common/LisstEmpty'
import ScreenHeader from 'components/common/ScreenHeader'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View } from '../components/Themed'
import { FlashList } from '@shopify/flash-list'
import Relayer from 'service'
import { useAppSelector } from 'store/hooks'
import { decrypt } from 'nostr-tools/nip04'
import { Event } from 'nostr-tools'

async function parseMessage(message: Event, iprivkey: string, ipubkey: string) {
  if (message.tags.find(([tag, value]) => tag === 'p' && value === ipubkey)) {
    return await decrypt(iprivkey, ipubkey, message.content)
  } else if (message.pubkey === ipubkey) {
    let result = message.tags.find(([tag]) => tag === 'p')
    if (result) {
      const [_, target] = result
      return await decrypt(iprivkey, target, message.content)
    }
    return null
  }
}

export default function Messages() {
  const [isLoading, setIsLoading] = useState(false)
  const { pubkey, privkey } = useAppSelector((state) => state.account)
  const [messages, setMessages] = useState([])

  const formatMessages = async (messages: Event[]) => {
    // const result = await Promise.all(
    //   messages.map((message) => parseMessage(message, privkey, pubkey))
    // )
    // console.log('result', result)
  }

  useEffect(() => {
    if (pubkey) {
      setTimeout(() => {
        const service = new Relayer()
        service
          .getMessagesByPubkey(pubkey)
          .then(formatMessages)
          .catch(console.log)
      }, 5000)
    }
  }, [pubkey])
  return (
    <View style={styles.container}>
      <ScreenHeader title="Messages" isBackable={false} />
      <FlashList
        data={[]}
        estimatedItemSize={80}
        renderItem={() => {
          return null
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
})
