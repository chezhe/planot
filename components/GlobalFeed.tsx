import { Event } from 'nostr-tools'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import Relayer from 'service'
import { CircleFade } from 'react-native-animated-spinkit'
import Post from './Post'
import { Text, View } from './Themed'

export default function GlobalFeed() {
  const [page, setPage] = useState(0)
  const [posts, setPosts] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const service = new Relayer()
        setIsLoading(true)
        setTimeout(() => {
          service
            .getGlobalFeed()
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
