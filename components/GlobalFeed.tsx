import { Event } from 'nostr-tools'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import Relayer from 'service'
import Post from './Post'
import { Text } from './Themed'

export default function GlobalFeed() {
  const [page, setPage] = useState(0)
  const [posts, setPosts] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const service = new Relayer()
        setTimeout(() => {
          service
            .getGlobalFeed()
            .then((res) => {
              console.log('posts', res)
              setPosts(res)
            })
            .catch(console.error)
        }, 10000)
      } catch (error) {}
    }

    init()
  }, [])

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => {
        return <Post post={item} />
      }}
    />
  )
}
