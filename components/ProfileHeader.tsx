import useColorScheme from 'hooks/useColorScheme'
import { Check, Copy, Flash, MessageText, SendMail } from 'iconoir-react-native'
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'
import { Profile } from 'types'
import { ellipsis } from 'utils'
import Box from './common/Box'
import Button from './common/Button'
import { Text, View } from './Themed'
import * as Clipboard from 'expo-clipboard'
import Icon from './common/Icon'
import { useState } from 'react'
import Toast from 'utils/toast'

export default function ProfileHeader({
  profile,
  pubkey,
}: {
  profile?: Profile
  pubkey?: string
}) {
  const [isCopying, setIsCopying] = useState(false)
  const theme = useColorScheme()
  const { width } = useWindowDimensions()
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
        <Animated.Image
          source={{ uri: profile?.picture }}
          style={[
            styles.avatar,
            {
              borderColor: Colors[theme].background,
            },
          ]}
        />

        <Box direction="row" style={styles.followButton} gap="medium">
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
            label="Follow"
            primary
            size="small"
            filled={false}
            style={{ width: 100 }}
            onPress={() => {}}
          />
        </Box>
      </ImageBackground>

      <Box
        direction="column"
        align="flex-start"
        justify="center"
        full
        style={{ paddingTop: 36 }}
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
              setIsCopying(true)
              await Clipboard.setStringAsync(pubkey || '')
              Toast.success('Copied')
              setTimeout(() => {
                setIsCopying(false)
              }, 1000)
            } catch (error) {
              setIsCopying(false)
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
            {isCopying ? (
              <Check width={24} height={24} color={Colors.gray} />
            ) : (
              <Copy width={24} height={24} color={Colors[theme].text} />
            )}
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
          <Text style={[styles.follow]}>Following</Text>
          <Text style={[styles.follow, { marginLeft: 20 }]}>Followers</Text>
        </View>
      </Box>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  follow: {
    fontSize: 16,
  },
  followButton: {
    position: 'absolute',
    right: 10,
    bottom: -40,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
})
