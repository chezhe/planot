import { Animated, FlatList, Image, StyleSheet } from 'react-native'

import { View } from '../components/Themed'
import { Profile, RootStackScreenProps } from '../types'
import { useEffect, useRef, useState } from 'react'
import Relayer from '../service'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Event } from 'nostr-tools'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRoute } from '@react-navigation/native'
import Post from 'components/Post'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Colors from 'theme/Colors'
import useColorScheme from 'hooks/useColorScheme'
import ProfileHeader from 'components/ProfileHeader'
import { NavArrowLeft } from 'iconoir-react-native'
import { hasDynamicIsland } from 'utils'
import Icon from 'components/common/Icon'
import { BlurView } from 'expo-blur'
import { CircleFade } from 'react-native-animated-spinkit'
import ListEmpty from 'components/common/LisstEmpty'

dayjs.extend(relativeTime)

export default function Account({
  navigation,
}: RootStackScreenProps<'Account'>) {
  const [profile, setProfile] = useState<Profile>()
  const [posts, setPosts] = useState<Event[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [offsetY, setOffsetY] = useState(0)

  const { params } = useRoute()
  const pubkey = (params as any).pubkey as string
  const insets = useSafeAreaInsets()
  const theme = useColorScheme()
  const profiles = useAppSelector((state) => state.profile)
  const dispatch = useAppDispatch()
  const scrollOffsetY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    async function initRelay() {
      try {
        const service = new Relayer()

        if (profiles[pubkey]) {
          setProfile(profiles[pubkey])
        } else {
          service
            .getProfile(pubkey)
            .then((res) => {
              dispatch({
                type: 'profiles/addProfile',
                payload: {
                  id: pubkey,
                  profile: res,
                },
              })
              setProfile(res)
            })
            .catch(console.error)
        }
        setIsLoading(true)
        service
          .getPostsByAuthor(pubkey)
          .then((res) => {
            setPosts(res)
            setIsLoading(false)
          })
          .catch(() => {
            setIsLoading(false)
          })
        // service
        //   .getFollowedByAuthor(pubkey)
        //   .then((res) => {
        //     console.log('following', res)
        //   })
        //   .catch(console.error)
      } catch (error) {
        console.log('error', error)
      }
    }

    initRelay()
  }, [pubkey])

  useEffect(() => {
    const listener = scrollOffsetY.addListener(({ value }) => {
      setOffsetY(value)
    })
    return () => {
      scrollOffsetY.removeListener(listener)
    }
  }, [scrollOffsetY])

  const backButton = (
    <Icon
      icon={
        <NavArrowLeft
          width={24}
          height={24}
          color={Colors[theme].screenBackground}
          strokeWidth={2}
        />
      }
      size={40}
      style={{ marginBottom: hasDynamicIsland() ? 10 : 0, marginLeft: 20 }}
      onPress={() => {
        navigation.goBack()
      }}
    />
  )

  return (
    <View style={{ flex: 1 }}>
      {offsetY > 100 ? (
        <BlurView
          intensity={60}
          tint={theme}
          style={[
            styles.back,
            {
              paddingTop: insets.top,
            },
          ]}
        >
          {backButton}
        </BlurView>
      ) : (
        <Animated.View
          style={[
            styles.back,
            {
              paddingTop: insets.top,
              backgroundColor: scrollOffsetY.interpolate({
                inputRange: [0, 100],
                outputRange: ['rgba(255,255,255,0)', 'rgba(220,220,220,0.95)'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          {backButton}
        </Animated.View>
      )}

      <FlatList
        data={(posts || []).sort((a, b) => b.created_at - a.created_at)}
        ListHeaderComponent={
          <ProfileHeader profile={profile} pubkey={pubkey} />
        }
        keyExtractor={({ id, sig }) => id!}
        style={{
          flex: isLoading ? undefined : 1,
          backgroundColor: Colors[theme].background,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        renderItem={({ item }) => {
          return <Post post={item} profile={profile} notFetchProfile />
        }}
        ListEmptyComponent={
          <ListEmpty isLoading={isLoading} title="No posts yet" />
        }
      />
    </View>
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
  back: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
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
