import { Animated, Pressable, StyleSheet } from 'react-native'

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
import Feed from '../components/Feed'
import GlobalFeed from '../components/GlobalFeed'
import { EditPencil, UserCircleAlt } from 'iconoir-react-native'

dayjs.extend(relativeTime)

export default function Home({ navigation }: RootTabScreenProps<'Home'>) {
  const routes = [
    { key: 'feed', title: 'Feed' },
    { key: 'global', title: 'Global' },
  ]

  const [index, setIndex] = useState(1)
  const pagerRef = useRef<PagerView>(null)

  const insets = useSafeAreaInsets()
  const theme = useColorScheme()

  const onTabChange = (_index: number) => {
    if (_index !== index) {
      setIndex(_index)
    }
  }

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
        <UserCircleAlt width={32} height={32} color="#999" />
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
          <Feed />
        </View>
        <View key="2">
          <GlobalFeed />
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
    paddingRight: 10,
  },
})
