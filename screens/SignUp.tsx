import Box from 'components/common/Box'
import Button from 'components/common/Button'
import Heading from 'components/common/Heading'
import ScreenHeader from 'components/common/ScreenHeader'
import { Copy, Refresh } from 'iconoir-react-native'
import { generatePrivateKey, getPublicKey } from 'nostr-tools'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'
import * as Clipboard from 'expo-clipboard'

import { Text, View } from '../components/Themed'
import { RootStackScreenProps } from '../types'
import Toast from 'utils/toast'
import { useAppDispatch } from 'store/hooks'

export default function SignUp({ navigation }: RootStackScreenProps<'SignUp'>) {
  const [privkey, setPrivkey] = useState('')
  const [pubkey, setPubkey] = useState('')

  function genPrivKey() {
    const privKey = generatePrivateKey()
    setPrivkey(privKey)

    const pubkey = getPublicKey(privKey)
    setPubkey(pubkey)
  }

  useEffect(() => {
    genPrivKey()
  }, [])

  const dispatch = useAppDispatch()

  function onConfirm() {
    dispatch({
      type: 'account/login',
      payload: {
        privkey,
        pubkey,
      },
    })
    navigation.popToTop()
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Sign up" />
      <View style={styles.content}>
        <View style={styles.privKeyWrap}>
          <Box direction="row" align="center" justify="space-between">
            <Heading level={2}>Private key</Heading>

            <Box direction="row" align="center" gap="small">
              <Pressable onPress={genPrivKey}>
                <Refresh width={28} height={28} color={Colors.gray9} />
              </Pressable>
              <Pressable
                onPress={async () => {
                  try {
                    await Clipboard.setStringAsync(privkey)
                    Toast.success('Copied to clipboard')
                  } catch (error) {
                    Toast.error(error)
                  }
                }}
              >
                <Copy width={32} height={32} color={Colors.gray9} />
              </Pressable>
            </Box>
          </Box>
          <Text style={styles.privKey}>{privkey}</Text>

          <Heading level={2} style={{ marginTop: 20 }}>
            Public key
          </Heading>
          <Text style={styles.privKey}>{pubkey}</Text>
        </View>
        <View style={styles.tipWrap}>
          <Text style={styles.tip}>
            Make sure you back up your private key!
          </Text>
          <Text style={styles.tip}>
            Posts are published using your private key. Others can see your
            posts or follow you using only your public key.
          </Text>
        </View>
        <Button label="Confirm" primary onPress={onConfirm} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 100,
  },
  privKeyWrap: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  privKey: {
    fontFamily: Fonts.variable,
    fontSize: 18,
    marginTop: 4,
  },
  tipWrap: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  tip: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 10,
  },
})
