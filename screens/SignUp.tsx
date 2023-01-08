import Box from 'components/common/Box'
import Button from 'components/common/Button'
import Heading from 'components/common/Heading'
import ScreenHeader from 'components/common/ScreenHeader'
import { Copy } from 'iconoir-react-native'
import { generatePrivateKey } from 'nostr-tools'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'
import * as Clipboard from 'expo-clipboard'

import { Text, View } from '../components/Themed'
import { RootStackScreenProps } from '../types'
import Toast from 'utils/toast'

export default function SignUp({ navigation }: RootStackScreenProps<'SignUp'>) {
  const [privKey, setPrivKey] = useState(
    'dd21d1593f30448180949feb472bba3e943b25b22e4f6aa55490c1664227d751'
  )
  useEffect(() => {
    // const privKey = generatePrivateKey()
    // setPrivKey(privKey)
  }, [])
  return (
    <View style={styles.container}>
      <ScreenHeader title="Sign up" />
      <View style={styles.content}>
        <View style={styles.privKeyWrap}>
          <Box direction="row" align="center" justify="space-between">
            <Heading level={2}>Private key</Heading>
            <Pressable
              onPress={async () => {
                try {
                  await Clipboard.setStringAsync(privKey)
                  Toast.success('Copied to clipboard')
                } catch (error) {
                  Toast.error(error)
                }
              }}
            >
              <Copy width={32} height={32} color={Colors.gray9} />
            </Pressable>
          </Box>
          <Text style={styles.privKey}>{privKey}</Text>
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
        <Button label="Confirm" primary onPress={() => {}} />
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
    alignItems: 'center',
    justifyContent: 'center',
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
