import dayjs from 'dayjs'
import { Event } from 'nostr-tools'
import { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Image, StyleSheet } from 'react-native'
import Relayer from 'service'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Fonts from 'theme/Fonts'
import { Profile } from 'types'
import { ellipsis } from 'utils'
import { Text, View } from './Themed'

export default function Post({
  post,
  profile,
}: {
  post: Event
  profile?: Profile
}) {
  const [iprofile, setIProfile] = useState(profile)
  const profiles = useAppSelector((state) => state.profile)
  const dispatch = useAppDispatch()
  const { width } = useWindowDimensions()

  useEffect(() => {
    if (profiles[post.pubkey]) {
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

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomColor: '#999',
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
    >
      <Image source={{ uri: iprofile?.picture }} style={styles.pavatar} />

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
        <Text
          style={[
            styles.post,
            {
              width: width - 20 - 50 - 8 - 20,
            },
          ]}
        >
          {post.content}
        </Text>
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
