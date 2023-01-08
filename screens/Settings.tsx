import ScreenHeader from 'components/common/ScreenHeader'
import SettingBlock from 'components/common/SettingBlock'
import { Brightness, ProfileCircled, Server } from 'iconoir-react-native'
import { ScrollView, StyleSheet } from 'react-native'
import { RootTabScreenProps } from 'types'
import { View } from '../components/Themed'

export default function Settings({
  navigation,
}: RootTabScreenProps<'Settings'>) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" isBackable={false} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <SettingBlock
          title="Account"
          items={[
            {
              icon: ProfileCircled,
              title: 'Account',
              value: '',
              onPress: () => {
                navigation.navigate('AccountEdit')
              },
            },
            {
              icon: Server,
              title: 'Relays',
              value: '',
              onPress: () => {},
            },
            {
              icon: Brightness,
              title: 'Display',
              value: '',
              onPress: () => {},
            },
          ]}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
})
