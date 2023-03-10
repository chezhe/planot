import { Event } from 'nostr-tools'
import { RefObject, useEffect, useState, forwardRef } from 'react'
import Relayer from 'service'
import Post from './Post'
import ListEmpty from './common/LisstEmpty'
import Toast from 'utils/toast'
import { FlashList } from '@shopify/flash-list'

interface Props {
  ref: RefObject<FlashList<Event>>
}

const GlobalFeed = forwardRef<FlashList<Event>, Props>((props, ref) => {
  const [page, setPage] = useState(0)
  const [posts, setPosts] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  function fetchFeed(refreshing: boolean) {
    setRefreshing(refreshing)
    const service = new Relayer()
    service
      .getGlobalFeed()
      .then((res) => {
        setIsLoading(false)
        setRefreshing(false)
        setPosts(res)
      })
      .catch((err) => {
        setIsLoading(false)
        setRefreshing(false)
        Toast.error(err)
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

export default GlobalFeed
