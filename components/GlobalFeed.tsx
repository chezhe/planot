import { Event } from 'nostr-tools'
import { RefObject, useEffect, useState, forwardRef } from 'react'
import { FlatList, Image } from 'react-native'
import Relayer from 'service'
import { CircleFade } from 'react-native-animated-spinkit'
import Post from './Post'
import { Text, View } from './Themed'
import ListEmpty from './common/LisstEmpty'
import Toast from 'utils/toast'

interface Props {
  ref: RefObject<FlatList>
}

const GlobalFeed = forwardRef<FlatList, Props>((props, ref) => {
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
            .getGlobalFeed()
            .then((res) => {
              setIsLoading(false)
              setPosts(res)
            })
            .catch((err) => {
              setIsLoading(false)
              Toast.error(err)
            })
        }, 10000)
      } catch (error) {}
    }

    init()
  }, [])

  return (
    <FlatList
      ref={ref}
      data={posts}
      renderItem={({ item }) => {
        return <Post post={item} />
      }}
      ListEmptyComponent={
        <ListEmpty isLoading={isLoading} title="No posts yet" />
      }
    />
  )
})

export default GlobalFeed
