import Box from 'components/common/Box'
import Button from 'components/common/Button'
import Heading from 'components/common/Heading'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Fonts from 'theme/Fonts'
import FastImage from 'react-native-fast-image'

import { Text, View } from '../components/Themed'
import { RootStackScreenProps } from '../types'

export default function Start({ navigation }: RootStackScreenProps<'Start'>) {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={{ padding: 20 }}>
        <Heading>Welcome to</Heading>
        <Heading>Planot</Heading>

        <Box direction="column" gap="medium" style={{ marginTop: 20 }}>
          <FastImage
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>NOSTR</Text>
          <Button
            label="Sign up"
            onPress={() => {
              navigation.navigate('SignUp')
            }}
          />
          <Button
            label="Login"
            primary
            onPress={() => {
              navigation.navigate('Login')
            }}
          />
        </Box>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontFamily: Fonts.heading,
  },
  logo: {
    width: 160,
    height: 160,
  },
})
