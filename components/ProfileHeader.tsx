import useColorScheme from 'hooks/useColorScheme'
import { Check, Copy, Flash, KeyAlt, SendMail } from 'iconoir-react-native'
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'
import { Follow, Profile } from 'types'
import { ellipsis } from 'utils'
import Box from './common/Box'
import Button from './common/Button'
import { Text, View } from './Themed'
import * as Clipboard from 'expo-clipboard'
import Icon from './common/Icon'
import { useEffect, useState } from 'react'
import Toast from 'utils/toast'
import { useAppSelector } from 'store/hooks'
import { useNavigation } from '@react-navigation/native'
import Relayer from 'service'
import Avatar from './common/Avatar'

export default function ProfileHeader({
  profile,
  pubkey,
}: {
  profile?: Profile
  pubkey?: string
}) {
  const [following, setFollowing] = useState<Follow[]>([])
  const theme = useColorScheme()
  const { width } = useWindowDimensions()
  const { pubkey: ipubkey, following: ifollowing } = useAppSelector(
    (state) => state.account
  )
  const navigation = useNavigation()

  useEffect(() => {
    if (ipubkey === pubkey) {
      setFollowing(ifollowing)
    } else if (pubkey) {
      const service = new Relayer()
      service
        .getFollowingByPubkey(pubkey)
        .then((res) => {
          setFollowing(res)
        })
        .catch(console.log)
    }
  }, [pubkey])

  const isFollowed = ifollowing.some((t) => t.pubkey === pubkey)

  const onToggleFollow = async () => {
    if (!pubkey) {
      return Toast.error('Invalid pubkey')
    }
    let tags = ifollowing
    if (isFollowed) {
      tags = tags.filter((t) => t.pubkey !== pubkey)
    } else {
      tags = tags.concat({ tag: 'p', pubkey: pubkey || '', relay: '' })
    }

    const followEvent = {
      pubkey: ipubkey,
      created_at: Math.floor(Date.now() / 1000),
      kind: 3,
      tags: tags.map((t) => [t.tag, t.pubkey, t.relay]),
      content: JSON.stringify([]),
    }
  }

  return (
    <Animated.View
      style={[
        {
          paddingHorizontal: 20,
          flexDirection: 'column',
          alignItems: 'center',
          borderBottomWidth: 1,
          paddingBottom: 10,
          borderBottomColor: Colors[theme].borderColor,
        },
      ]}
    >
      <ImageBackground
        source={require('../assets/images/nighthawks.jpg')}
        style={{ width, height: 160 }}
        resizeMode="cover"
      >
        <Avatar
          size={70}
          pubkey={pubkey || ''}
          src={profile?.picture}
          style={{ ...styles.avatar, borderColor: Colors[theme].background }}
        />
      </ImageBackground>

      {ipubkey !== pubkey ? (
        <Box direction="row" full style={styles.followButton} gap="medium">
          <Icon
            icon={<Flash width={20} height={20} color={Colors.black} />}
            style={styles.iconWrap}
            backgroundColor={Colors.yellow}
            size={32}
            isTransparent
            onPress={() => {}}
          />
          <Icon
            icon={<SendMail width={20} height={20} color={Colors.white} />}
            style={styles.iconWrap}
            backgroundColor={Colors.link}
            size={32}
            isTransparent
            onPress={() => {}}
          />
          <Button
            label={isFollowed ? 'Unfollow' : 'Follow'}
            primary={!isFollowed}
            size="small"
            filled={false}
            style={{ width: 100 }}
            onPress={onToggleFollow}
          />
        </Box>
      ) : (
        <Box direction="row" full style={styles.followButton} gap="medium">
          <Button
            label="Edit"
            primary={false}
            size="small"
            filled={false}
            style={{ width: 100 }}
            onPress={() => {
              navigation.navigate('AccountEdit')
            }}
          />
        </Box>
      )}

      <Box
        direction="column"
        align="flex-start"
        justify="center"
        gap="small"
        full
        style={{ paddingTop: 0 }}
      >
        <Animated.Text
          style={[
            styles.title,
            {
              color: Colors[theme].text,
            },
          ]}
        >
          {profile?.name}
        </Animated.Text>
        <Pressable
          onPress={async () => {
            try {
              await Clipboard.setStringAsync(pubkey || '')
              Toast.success('Copied')
            } catch (error) {
              Toast.error(error)
            }
          }}
        >
          <Box
            direction="row"
            gap="small"
            style={{
              ...styles.pubkeyWrap,
              backgroundColor: Colors[theme].bannerBackground,
            }}
          >
            <KeyAlt width={24} height={24} color={Colors.gray} />
            <Animated.Text
              style={[
                styles.pubkey,
                {
                  color: Colors[theme].text,
                },
              ]}
            >
              {ellipsis(pubkey, 10, 8)}
            </Animated.Text>
          </Box>
        </Pressable>

        <Text style={styles.about} numberOfLines={2}>
          {profile?.about}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() =>
              navigation.navigate('AccountList', {
                title: `Following`,
                accounts: following,
              })
            }
          >
            <Text style={[styles.follow]}>
              <Text style={styles.count}>{following.length}</Text> Following
            </Text>
          </Pressable>
          <Pressable style={{ marginLeft: 20 }}>
            <Text style={[styles.follow]}>Followers</Text>
          </Pressable>
        </View>
      </Box>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  follow: {
    fontSize: 16,
    color: '#999',
  },
  followButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  avatar: {
    position: 'absolute',
    left: 20,
    bottom: -35,
    borderWidth: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.heading,
  },
  about: {
    fontSize: 16,
    color: '#999',
  },
  pubkeyWrap: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pubkey: {
    fontSize: 16,
    fontFamily: Fonts.variable,
  },
  iconWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    margin: 0,
  },
  count: {
    fontFamily: Fonts.heading,
  },
})
