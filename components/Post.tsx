import dayjs from 'dayjs'
import { Event } from 'nostr-tools'
import { useEffect, useState } from 'react'
import { Pressable, useWindowDimensions } from 'react-native'
import { StyleSheet } from 'react-native'
import Relayer from 'service'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Fonts from 'theme/Fonts'
import { PreviewOfURL, Profile } from 'types'
import { ellipsis } from 'utils'
import { getLinkPreview } from 'link-preview-js'
import { Text, View } from './Themed'
import Preview from './Preview'
import Content from './Content'
import { StackActions, useNavigation } from '@react-navigation/native'
import PostBar from './PostBar'
import Colors from 'theme/Colors'
import useColorScheme from 'hooks/useColorScheme'
import Avatar from './common/Avatar'
import Box from './common/Box'
import LoadingPost from './Skeleton/LoadingPost'

export default function Post({
  post,
  profile,
  notFetchProfile,
  isRoot = true,
  onlyRenderSelf = false,
}: {
  post: Event
  profile?: Profile
  notFetchProfile?: boolean
  isRoot?: boolean
  onlyRenderSelf?: boolean
}) {
  const [iprofile, setIProfile] = useState(profile)
  const [preview, setPreview] = useState<PreviewOfURL>()
  const [repliedTo, setRepliedTo] = useState<Event>()
  const [fetchingContext, setFetchingContext] = useState(false)

  const profiles = useAppSelector((state) => state.profile)
  const dispatch = useAppDispatch()
  const { width } = useWindowDimensions()
  const navigation = useNavigation()
  const theme = useColorScheme()

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

    async function fetchContext(id: string) {
      try {
        if (!repliedTo) {
          setFetchingContext(true)
        }
        const service = new Relayer()
        const repliedPost = await service.getPostById(id)

        setRepliedTo(repliedPost)
        setFetchingContext(false)
      } catch (error) {
        console.log('error', error)
        setFetchingContext(false)
      }
    }

    if (isRoot && !onlyRenderSelf) {
      const tags = post.tags

      if (
        tags.some((tag) => tag[0] === 'e') &&
        tags.some((tag) => tag[0] === 'p')
      ) {
        const etags = tags.filter((tag) => tag[0] === 'e')
        const id = etags[0][1]
        fetchContext(id)
      }
    }
  }, [post, isRoot, onlyRenderSelf])

  const contentWidth = width - 20 - 50 - 8 - 20

  return (
    <Pressable onPress={() => navigation.navigate('Note', { note: post })}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: 20,
          },
          !isRoot || onlyRenderSelf
            ? {
                borderColor: Colors[theme].borderColor,
                borderWidth: 1,
                borderRadius: 8,
                marginTop: 10,
                paddingVertical: 4,
                paddingHorizontal: 0,
                paddingLeft: onlyRenderSelf ? 10 : 0,
              }
            : {
                borderBottomColor: Colors[theme].borderColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
        ]}
      >
        {isRoot && (
          <Pressable
            onPress={() =>
              navigation.dispatch(
                StackActions.push('Account', { pubkey: post.pubkey })
              )
            }
          >
            <Avatar src={iprofile?.picture} size={50} pubkey={post.pubkey} />
          </Pressable>
        )}

        <View style={{ paddingLeft: 8, paddingTop: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!isRoot && (
              <Pressable
                style={{ marginRight: 10 }}
                onPress={() =>
                  navigation.dispatch(
                    StackActions.push('Account', { pubkey: post.pubkey })
                  )
                }
              >
                <Avatar
                  src={iprofile?.picture}
                  size={30}
                  pubkey={post.pubkey}
                />
              </Pressable>
            )}
            <View
              style={{
                flexDirection: isRoot ? 'row' : 'column',
                alignItems: isRoot ? 'center' : 'flex-start',
              }}
            >
              <Text
                style={{
                  fontSize: isRoot ? 18 : 16,
                  fontFamily: Fonts.heading,
                }}
              >
                {iprofile?.name || ellipsis(post.pubkey, 6, 6)}
              </Text>
              <Text
                style={{
                  color: '#999',
                  marginLeft: isRoot ? 8 : 0,
                  fontSize: isRoot ? 14 : 12,
                }}
              >
                {dayjs(post.created_at * 1000).fromNow()}
              </Text>
            </View>
          </View>
          {preview && preview.url === post.content ? null : (
            <Text
              style={[
                styles.post,
                {
                  width: contentWidth - (isRoot ? 0 : 20),
                },
              ]}
            >
              <Content content={post.content} />
            </Text>
          )}
          <Preview preview={preview} isRoot={isRoot} />
          {repliedTo && <Post post={repliedTo} isRoot={false} />}
          {fetchingContext && (
            <Box
              direction="column"
              align="center"
              justify="center"
              pad="medium"
              style={{
                borderColor: Colors[theme].borderColor,
                borderWidth: 1,
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              <LoadingPost />
            </Box>
          )}
          {isRoot && !onlyRenderSelf && <PostBar post={post} />}
        </View>
      </View>
    </Pressable>
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
