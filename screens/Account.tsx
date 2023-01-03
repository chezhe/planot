import { FlatList, Image, StyleSheet } from 'react-native'

import { Text, View } from '../components/Themed'
import { Profile, RootStackScreenProps } from '../types'
import { useEffect, useState } from 'react'
import Relayer from '../service'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Event } from 'nostr-tools'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRoute } from '@react-navigation/native'
import Post from 'components/Post'

dayjs.extend(relativeTime)

export default function Account({
  navigation,
}: RootStackScreenProps<'Account'>) {
  const [profile, setProfile] = useState<Profile>()
  const [posts, setPosts] = useState<Event[]>()

  const { params } = useRoute()
  const pubkey = (params as any).pubkey as string
  const insets = useSafeAreaInsets()

  useEffect(() => {
    async function initRelay() {
      try {
        const service = new Relayer()

        service
          .getProfile(pubkey)
          .then((res) => {
            setProfile(res)
          })
          .catch(console.error)
        service
          .getPostsByAuthor(pubkey)
          .then((res) => {
            setPosts(res)
          })
          .catch(console.error)
        service
          .getFollowedByAuthor(pubkey)
          .then((res) => {
            // console.log('following', res)
          })
          .catch(console.error)
      } catch (error) {
        console.log('error', error)
      }
    }

    initRelay()
  }, [pubkey])

  return (
    <FlatList
      data={(posts || []).sort((a, b) => b.created_at - a.created_at)}
      keyExtractor={({ id, sig }) => id!}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      ListHeaderComponent={() => (
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: 20,
              paddingVertical: 10,
            },
          ]}
        >
          <Image source={{ uri: profile?.picture }} style={styles.avatar} />
          <View
            style={{
              marginLeft: 10,
            }}
          >
            <Text style={styles.title}>{profile?.name}</Text>
            <Text style={styles.about}>{profile?.about}</Text>
          </View>
        </View>
      )}
      renderItem={({ item }) => {
        return <Post post={item} profile={profile} />
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  title: {
    fontSize: 20,
  },
  about: {
    fontSize: 16,
    color: '#999',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  pseparator: {
    marginVertical: 5,
    height: 1,
    width: '80%',
  },
  pavatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#999',
    borderWidth: StyleSheet.hairlineWidth,
  },
  post: {
    fontSize: 16,
    marginTop: 4,
  },
})
