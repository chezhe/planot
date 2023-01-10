import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import Relayer from 'service'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'
import { Profile } from 'types'
import Avatar from './common/Avatar'
import { Text, View } from './Themed'

export default function AccountItem({ pubkey }: { pubkey: string }) {
  const [iprofile, setIProfile] = useState<Profile>()
  const profiles = useAppSelector((state) => state.profile)
  const dispatch = useAppDispatch()
  const { width } = useWindowDimensions()
  const navigation = useNavigation()

  useEffect(() => {
    if (profiles[pubkey]) {
      setIProfile(profiles[pubkey])
    } else {
      async function initRelay() {
        try {
          const service = new Relayer()
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
              setIProfile(res)
            })
            .catch(() => {})
        } catch (error) {
          console.log('error', error)
        }
      }
      initRelay()
    }
  }, [])

  return (
    <Pressable onPress={() => navigation.navigate('Account', { pubkey })}>
      <View style={styles.wrap}>
        <Avatar src={iprofile?.picture} pubkey={pubkey} size={50} />
        <View style={styles.info}>
          <Text style={styles.name}>{iprofile?.name}</Text>

          <Text
            style={[
              styles.about,
              {
                width: width - 100,
              },
            ]}
            numberOfLines={2}
          >
            {iprofile?.about}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
  },
  info: {
    marginLeft: 10,
  },
  name: {
    fontFamily: Fonts.heading,
    fontSize: 20,
  },
  about: {
    fontSize: 16,
    color: Colors.gray9,
  },
})
