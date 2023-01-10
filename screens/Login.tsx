import Box from 'components/common/Box'
import Button from 'components/common/Button'
import ScreenHeader from 'components/common/ScreenHeader'
import { useState } from 'react'
import { StyleSheet } from 'react-native'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'
import { View } from '../components/Themed'
import { RootStackScreenProps } from '../types'
import Toast from 'utils/toast'
import AnimatedInput from 'components/common/AnimatedInput'
import useColorScheme from 'hooks/useColorScheme'
import { getPublicKey } from 'nostr-tools'
import { useAppDispatch } from 'store/hooks'

export default function Login({ navigation }: RootStackScreenProps<'Login'>) {
  const [privkey, setPrivkey] = useState('')
  const [pubkey, setPubkey] = useState('')
  const [focused, setFocused] = useState(false)

  const theme = useColorScheme()

  const dispatch = useAppDispatch()

  function onConfirm() {
    try {
      const pubkey = getPublicKey(privkey)
      setPubkey(pubkey)
      dispatch({
        type: 'account/login',
        payload: {
          privkey,
          pubkey,
        },
      })
      navigation.popToTop()
    } catch (error) {
      Toast.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Login" />
      <View style={styles.content}>
        <Box direction="column" gap="large" full>
          <Box
            full
            style={{
              paddingVertical: 4,
              borderBottomWidth: 1,
              borderBottomColor: focused
                ? Colors[theme].text
                : Colors[theme].borderColor,
              height: 80,
            }}
          >
            <AnimatedInput
              placeholder="Private Key"
              value={privkey}
              onChangeText={(_text) => setPrivkey(_text)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholderTextColor={Colors.gray9}
              animatedLeft={0}
              maxLength={64}
              autoCorrect={false}
              multiline
              numberOfLines={3}
              style={{ fontSize: 18, height: 160 }}
            />
          </Box>

          <Button label="Proceed" primary onPress={onConfirm} />
        </Box>
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
    paddingBottom: 100,
  },
  privKeyWrap: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
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
