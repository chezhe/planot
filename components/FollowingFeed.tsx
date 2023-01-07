import { Event } from 'nostr-tools'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { CircleFade } from 'react-native-animated-spinkit'
import Relayer from 'service'
import Post from './Post'
import { Text, View } from './Themed'

export default function FollowingFeed() {
  const [page, setPage] = useState(0)
  const [posts, setPosts] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true)
        setTimeout(() => {
          const service = new Relayer()
          service
            .getFollowingFeed([])
            .then((res) => {
              setIsLoading(false)
              setPosts(res)
            })
            .catch(() => {
              setIsLoading(false)
            })
        }, 10000)
      } catch (error) {}
    }

    init()
  }, [])
  console.log('posts', posts.length)

  if (isLoading) {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 50,
        }}
      >
        <CircleFade size={100} color="#999" />
      </View>
    )
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => {
        return <Post post={item} />
      }}
    />
  )
}
