import ScreenHeader from 'components/common/ScreenHeader'
import { StyleSheet } from 'react-native'

import { View } from '../components/Themed'
import { RootStackScreenProps } from '../types'

export default function Note({ navigation }: RootStackScreenProps<'Note'>) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Note" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
})
