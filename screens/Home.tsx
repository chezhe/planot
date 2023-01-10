import { Animated, FlatList, Pressable, StyleSheet } from 'react-native'

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
import { EditPencil, Search } from 'iconoir-react-native'
import Relayer from 'service'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Toast from 'utils/toast'
import { useScrollToTop } from '@react-navigation/native'
import Avatar from 'components/common/Avatar'

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
              dispatch({
                type: 'profiles/addProfile',
                payload: {
                  id: pubkey,
                  profile: res,
                },
              })
            })
            .catch(() => Toast.error('Profile not set yet'))
        }, 3000)
      } catch (error) {
        console.log('error', error)
      }
    }
    if (!pubkey) {
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
    const service = new Relayer()
    setTimeout(() => {
      service
        .getFollowingByPubkey(pubkey)
        .then((res) => {
          dispatch({
            type: 'account/updateFollowing',
            payload: res,
          })
        })
        .catch(console.error)
    }, 5000)
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
          <Pressable style={{ position: 'relative', top: 1 }}>
            <Search width={44} height={44} color={Colors.gray9} />
          </Pressable>
        </View>
        <Pressable
          style={{ marginHorizontal: 20 }}
          onPress={() => navigation.navigate('Account', { pubkey })}
        >
          <Avatar src={profiles[pubkey]?.picture} size={40} pubkey={pubkey} />
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
      <Pressable onPress={() => navigation.navigate('PostNote', {})}>
        <View style={styles.postWrap}>
          <EditPencil width={30} height={30} strokeWidth={2} color="#000" />
        </View>
      </Pressable>
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
    paddingBottom: 6,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: Colors.gray9,
    borderBottomWidth: 4,
    flex: 1,
    marginHorizontal: 10,
  },
  tabItem: {
    borderBottomWidth: 4,
    position: 'relative',
    top: 4,
    marginRight: 15,
  },
  pagerView: {
    flex: 1,
  },
  tabWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  postWrap: {
    position: 'absolute',
    backgroundColor: Colors.yellow,
    padding: 10,
    right: 10,
    bottom: 10,
    borderRadius: 25,
  },
})
