import { FlatList, Image, StyleSheet } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { View } from '../components/Themed'
import ScreenHeader from 'components/common/ScreenHeader'
import { useEffect, useState } from 'react'
import Relayer from 'service'
import Toast from 'utils/toast'
import Post from 'components/Post'
import { Event } from 'nostr-tools'
import { CircleFade } from 'react-native-animated-spinkit'
import ListEmpty from 'components/common/LisstEmpty'

export default function HashTag() {
  const { params } = useRoute()
  const tag = (params as any).tag as string
  const [posts, setPosts] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true)
        const service = new Relayer()
        const results = await service.getNotesByHashTag(tag)

        setPosts(results)
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        Toast.error(err)
      }
    }
    fetchPosts()
  }, [tag])

  return (
    <View style={styles.container}>
      <ScreenHeader title={`#${tag}`} />
      <FlatList
        data={posts}
        renderItem={({ item }) => {
          return <Post post={item} />
        }}
        ListEmptyComponent={
          <ListEmpty isLoading={isLoading} title={`No posts with #${tag}`} />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
