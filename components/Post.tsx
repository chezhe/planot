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

export default function Post({
  post,
  profile,
}: {
  post: Event
  profile?: Profile
}) {
  const [iprofile, setIProfile] = useState(profile)
  const [preview, setPreview] = useState<PreviewOfURL>()

  const profiles = useAppSelector((state) => state.profile)
  const dispatch = useAppDispatch()
  const { width } = useWindowDimensions()
  const navigation = useNavigation()

  useEffect(() => {
    if (profile) {
      setIProfile(profile)
    } else if (profiles[post.pubkey]) {
      setIProfile(profiles[post.pubkey])
    } else {
      async function initRelay() {
        try {
          const service = new Relayer()
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
        } catch (error) {
          console.log('error', error)
        }
      }
      initRelay()
    }
  }, [iprofile, profiles])

  useEffect(() => {
    getLinkPreview(post.content)
      .then((data) => {
        console.log(data)
        setPreview(data)
      })
      .catch(console.error)
  }, [post])

  const contentWidth = width - 20 - 50 - 8 - 20

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomColor: '#999',
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
