import { Event } from 'nostr-tools'
import { RefObject, useEffect, useState, forwardRef } from 'react'
import Relayer from 'service'
import { useAppSelector } from 'store/hooks'
import ListEmpty from './common/LisstEmpty'
import Post from './Post'
import { FlashList } from '@shopify/flash-list'

interface Props {
  ref: RefObject<FlashList<Event>>
}

const FollowingFeed = forwardRef<FlashList<Event>, Props>((props, ref) => {
  const [page, setPage] = useState(0)
  const [posts, setPosts] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { pubkey, following } = useAppSelector((state) => state.account)

  function fetchFeed(refreshing: boolean) {
    setRefreshing(refreshing)
    const service = new Relayer()
    service
      .getFollowingFeed(pubkey, following)
      .then((res) => {
        setIsLoading(false)
        setRefreshing(false)
        setPosts(res)
      })
      .catch(() => {
        setIsLoading(false)
        setRefreshing(false)
      })
  }
  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true)
        setTimeout(() => {
          fetchFeed(false)
        }, 5000)
      } catch (error) {}
    }

    init()
  }, [])

  return (
    <FlashList
      ref={ref}
      estimatedItemSize={80}
      data={posts}
      renderItem={({ item }) => {
        return <Post post={item} />
      }}
      ListEmptyComponent={
        <ListEmpty isLoading={isLoading} title="No posts yet" />
      }
      onRefresh={() => fetchFeed(true)}
      refreshing={refreshing}
    />
  )
})

export default FollowingFeed
