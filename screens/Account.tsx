import { Animated, FlatList, Image, StyleSheet } from 'react-native'

import { Text, View } from '../components/Themed'
import { Profile, RootStackScreenProps } from '../types'
import { useEffect, useRef, useState } from 'react'
import Relayer from '../service'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Event } from 'nostr-tools'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRoute } from '@react-navigation/native'
import Post from 'components/Post'
import ScreenHeader from 'components/common/ScreenHeader'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Fonts from 'theme/Fonts'
import Box from 'components/common/Box'
import Button from 'components/common/Button'
import Colors from 'theme/Colors'
import useColorScheme from 'hooks/useColorScheme'

dayjs.extend(relativeTime)

export default function Account({
  navigation,
}: RootStackScreenProps<'Account'>) {
  const [profile, setProfile] = useState<Profile>()
  const [posts, setPosts] = useState<Event[]>()

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
        service
          .getPostsByAuthor(pubkey)
          .then((res) => {
            setPosts(res)
          })
          .catch(console.error)
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
  }, [pubkey, profiles])

  console.log('profile', profile)

  const maxOffsetY = 250

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Back" />
      <Animated.View
        style={[
          {
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: 'column',
            alignItems: 'center',
            maxHeight: scrollOffsetY.interpolate({
              inputRange: [0, maxOffsetY, maxOffsetY + 1],
              outputRange: [maxOffsetY, 0, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <Animated.Image
          source={{ uri: profile?.picture }}
          style={[
            styles.avatar,
            {
              transform: [
                {
                  scale: scrollOffsetY.interpolate({
                    inputRange: [0, maxOffsetY, maxOffsetY + 1],
                    outputRange: [1, 0.7, 0.7],
                    extrapolate: 'clamp',
                  }),
                },
                {
                  translateY: scrollOffsetY.interpolate({
                    inputRange: [0, maxOffsetY, maxOffsetY + 1],
                    outputRange: [0, -100, -100],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        />

        <Box direction="column" align="center" justify="center" gap="small">
          <Animated.Text
            style={[
              styles.title,
              {
                color: Colors[theme].text,
                fontSize: scrollOffsetY.interpolate({
                  inputRange: [0, maxOffsetY, maxOffsetY + 1],
                  outputRange: [30, 20, 20],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateY: scrollOffsetY.interpolate({
                      inputRange: [0, maxOffsetY, maxOffsetY + 1],
                      outputRange: [0, -20, -20],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          >
            {profile?.name}
          </Animated.Text>
          <Text style={styles.about} numberOfLines={2}>
            {profile?.about}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={[styles.follow]}>Following</Text>
            <Text style={[styles.follow, { marginLeft: 20 }]}>Followers</Text>
          </View>
          <Button
            label="Follow"
            primary
            size="small"
            filled={false}
            style={{ width: 100 }}
            onPress={() => {}}
          />
        </Box>
      </Animated.View>
      <FlatList
        data={(posts || []).sort((a, b) => b.created_at - a.created_at)}
        keyExtractor={({ id, sig }) => id!}
        style={{ flex: 1, backgroundColor: Colors[theme].background }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        renderItem={({ item }) => {
          return <Post post={item} profile={profile} notFetchProfile />
        }}
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
  follow: {
    fontSize: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  title: {
    fontSize: 30,
    fontFamily: Fonts.heading,
  },
  about: {
    fontSize: 16,
    color: '#999',
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
