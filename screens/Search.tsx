import ScreenHeader from 'components/common/ScreenHeader'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'

import { Text, View } from '../components/Themed'
import { RootStackScreenProps } from '../types'

export default function Search({ navigation }: RootStackScreenProps<'Search'>) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Search" />
      <TextInput
        style={styles.input}
        placeholder="Search by pubkey, name or keywords"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    fontSize: 20,
    fontFamily: Fonts.variable,
    borderColor: Colors.gray9,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
})
