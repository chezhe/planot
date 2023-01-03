import { FlatList, Image, StyleSheet } from 'react-native'

import { Text, View } from '../components/Themed'
import { Profile, RootStackScreenProps } from '../types'
import { useEffect, useState } from 'react'
import Relayer from '../service'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Event } from 'nostr-tools'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function Account({
  navigation,
}: RootStackScreenProps<'Account'>) {
  const [profile, setProfile] = useState<Profile>()
  const [posts, setPosts] = useState<Event[]>()

  const insets = useSafeAreaInsets()

  useEffect(() => {
    async function initRelay() {
      try {
        const service = new Relayer()

        setTimeout(() => {
          service
            .getProfile(
              'fd526aaff431de56fdd52688d88ca65d27ae547e686b21fda4b2d1177cefb4f4'
            )
            .then((res) => {
              setProfile(res)
            })
            .catch(console.error)
          service
            .getPostsByAuthor(
              'fd526aaff431de56fdd52688d88ca65d27ae547e686b21fda4b2d1177cefb4f4'
            )
            .then((res) => {
              setPosts(res)
            })
            .catch(console.error)
          service
            .getFollowedByAuthor(
              'fd526aaff431de56fdd52688d88ca65d27ae547e686b21fda4b2d1177cefb4f4'
            )
            .then((res) => {
              // console.log('following', res)
            })
            .catch(console.error)
        }, 10000)
      } catch (error) {
        console.log('error', error)
      }
    }

    initRelay()
  }, [])

  console.log('posts', posts);
  

  return (
    <FlatList
      data={(posts || []).sort((a, b) => b.created_at - a.created_at)}
      keyExtractor={({ id, sig }) => id!}
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
        return (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              paddingVertical: 10,
              width: '100%',
              borderBottomColor: '#999',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          >
            <Image source={{ uri: profile?.picture }} style={styles.pavatar} />

            <View style={{ paddingLeft: 8, paddingTop: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  {profile?.name}
                </Text>
                <Text style={{ color: '#999', marginLeft: 8 }}>
                  {dayjs(item.created_at * 1000).fromNow()}
                </Text>
              </View>
              <Text style={styles.post}>{item.content}</Text>
            </View>
          </View>
        )
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
