import { Event } from 'nostr-tools'
import { RefObject, useEffect, useState, forwardRef } from 'react'
import { FlatList } from 'react-native'
import { CircleFade } from 'react-native-animated-spinkit'
import Relayer from 'service'
import ListEmpty from './common/LisstEmpty'
import Post from './Post'
import { View } from './Themed'

interface Props {
  ref: RefObject<FlatList>
}

const FollowingFeed = forwardRef<FlatList, Props>((props, ref) => {
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

export default FollowingFeed
