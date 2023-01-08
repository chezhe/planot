import { Animated, FlatList, Image, Pressable, StyleSheet } from 'react-native'

import { Text, View } from '../components/Themed'
import { RootTabScreenProps } from '../types'
import { useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'
import useColorScheme from '../hooks/useColorScheme'
import PagerView from 'react-native-pager-view'
import FollowingFeed from '../components/FollowingFeed'
import GlobalFeed from '../components/GlobalFeed'
import { EditPencil, UserCircleAlt } from 'iconoir-react-native'
import Relayer from 'service'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Toast from 'utils/toast'
import { useScrollToTop } from '@react-navigation/native'

dayjs.extend(relativeTime)

export default function Home({ navigation }: RootTabScreenProps<'Home'>) {
  const routes = [
    { key: 'feed', title: 'Feed' },
    { key: 'global', title: 'Global' },
  ]

  const [index, setIndex] = useState(0)
  const pagerRef = useRef<PagerView>(null)
  const followListRef = useRef<FlatList>(null)
  const globalListRef = useRef<FlatList>(null)

  const insets = useSafeAreaInsets()
  const theme = useColorScheme()
  const dispatch = useAppDispatch()

  const { pubkey } = useAppSelector((state) => state.account)
  const profiles = useAppSelector((state) => state.profile)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const service = new Relayer()
        setTimeout(() => {
          service
            .getProfile(pubkey)
            .then((res) => {
              console.log('fetching profile', res)

              dispatch({
                type: 'profiles/addProfile',
                payload: {
                  id: pubkey,
                  profile: res,
                },
              })
            })
            .catch(() => Toast.error('Failed to fetch profile'))
        }, 3000)
      } catch (error) {
        console.log('error', error)
      }
    }
    // !pubkey
    if (true) {
      // navigate register screen
      navigation.navigate('Start')
    } else if (!profiles[pubkey]) {
      fetchProfile()
    }
  }, [pubkey])

  const onTabChange = (_index: number) => {
    if (_index !== index) {
      setIndex(_index)
    }
  }

  useEffect(() => {
    new Relayer()
  }, [])

  useScrollToTop(followListRef)
  useScrollToTop(globalListRef)

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.tabWrap}>
        <View style={styles.tabBar}>
          {routes.map((route, i) => {
            const isActive = index === i
            return (
              <Pressable
                key={i}
                style={[
                  styles.tabItem,
                  {
                    borderColor: isActive ? Colors[theme].text : 'transparent',
                  },
                ]}
                onPress={() => {
                  pagerRef.current?.setPage(i)
                }}
              >
                <Animated.Text
                  style={[
                    styles.heading,
                    { opacity: isActive ? 1 : 0.5, color: Colors[theme].text },
                  ]}
                >
                  {route.title}
                </Animated.Text>
              </Pressable>
            )
          })}
        </View>
        <Pressable onPress={() => navigation.navigate('Account', { pubkey })}>
          <Image
            source={
              profiles[pubkey]
                ? { uri: profiles[pubkey].picture }
                : require('../assets/images/default-avatar.png')
            }
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
        </Pressable>
      </View>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={index}
        onPageScroll={(e) => {
          onTabChange(e.nativeEvent.position)
        }}
      >
        <View key="1">
          <FollowingFeed ref={followListRef} />
        </View>
        <View key="2">
          <GlobalFeed ref={globalListRef} />
        </View>
      </PagerView>
      <View
        style={{
          position: 'absolute',
          backgroundColor: Colors.yellow,
          padding: 10,
          right: 10,
          bottom: 10,
          borderRadius: 25,
        }}
      >
        <EditPencil width={30} height={30} strokeWidth={2} color="#000" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontFamily: Fonts.heading,
    fontSize: 30,
    lineHeight: 40,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  tabItem: {
    marginHorizontal: 10,
    borderBottomWidth: 4,
  },
  pagerView: {
    flex: 1,
  },
  tabWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 18,
  },
})
