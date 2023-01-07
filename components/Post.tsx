import dayjs from 'dayjs'
import { Event } from 'nostr-tools'
import { useEffect, useState } from 'react'
import { Pressable, useWindowDimensions } from 'react-native'
import { Image, StyleSheet } from 'react-native'
import Relayer from 'service'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Fonts from 'theme/Fonts'
import { PreviewOfURL, Profile } from 'types'
import { ellipsis } from 'utils'
import { getLinkPreview } from 'link-preview-js'
import { Text, View } from './Themed'
import Preview from './Preview'
import Content from './Content'
import { useNavigation } from '@react-navigation/native'
import PostBar from './PostBar'
import Colors from 'theme/Colors'
import useColorScheme from 'hooks/useColorScheme'

export default function Post({
  post,
  profile,
  notFetchProfile,
}: {
  post: Event
  profile?: Profile
  notFetchProfile?: boolean
}) {
  const [iprofile, setIProfile] = useState(profile)
  const [preview, setPreview] = useState<PreviewOfURL>()

  const profiles = useAppSelector((state) => state.profile)
  const dispatch = useAppDispatch()
  const { width } = useWindowDimensions()
  const navigation = useNavigation()
  const theme = useColorScheme()
  // console.log('post', post)

  useEffect(() => {
    if (profile) {
      setIProfile(profile)
    } else if (profiles[post.pubkey]) {
      setIProfile(profiles[post.pubkey])
    } else {
      async function initRelay() {
        try {
          const service = new Relayer()
          if (!notFetchProfile) {
            service
              .getProfile(post.pubkey)
              .then((res) => {
                dispatch({
                  type: 'profiles/addProfile',
                  payload: {
                    id: post.pubkey,
                    profile: res,
                  },
                })
                setIProfile(res)
              })
              .catch(() => {})
          }
        } catch (error) {
          console.log('error', error)
        }
      }
      initRelay()
    }
  }, [profile])

  useEffect(() => {
    getLinkPreview(post.content)
      .then((data) => {
        setPreview(data)
      })
      .catch(() => {})

    // async function fetchContext(pid: string) {
    //   console.log('pid', pid)

    //   try {
    //     const service = new Relayer()
    //     const repliedPost = await service.getPostById(pid)
    //     console.log('repliedPost', repliedPost)
    //   } catch (error) {
    //     console.log('error', error)
    //   }
    // }

    // const tags = post.tags
    // if (tags.some((tag) => tag[0] === 'p')) {
    //   const ptags = tags.filter((tag) => tag[0] === 'p')
    //   const pid = ptags[0][1]
    //   fetchContext(pid)
    // }
  }, [post])

  const contentWidth = width - 20 - 50 - 8 - 20

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomColor: Colors[theme].borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
    >
      <Pressable
        onPress={() => navigation.navigate('Account', { pubkey: post.pubkey })}
      >
        <Image
          source={
            iprofile?.picture
              ? { uri: iprofile?.picture }
              : require('../assets/images/default-avatar.png')
          }
          style={styles.pavatar}
        />
      </Pressable>

      <View style={{ paddingLeft: 8, paddingTop: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.heading,
            }}
          >
            {iprofile?.name || ellipsis(post.pubkey, 10)}
          </Text>
          <Text style={{ color: '#999', marginLeft: 8 }}>
            {dayjs(post.created_at * 1000).fromNow()}
          </Text>
        </View>
        {preview && preview.url === post.content ? null : (
          <Text
            style={[
              styles.post,
              {
                width: contentWidth,
              },
            ]}
          >
            <Content content={post.content} />
          </Text>
        )}
        <Preview preview={preview} />
        <PostBar post={post} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
