import { useRoute } from '@react-navigation/native'
import AccountItem from 'components/AccountItem'
import ScreenHeader from 'components/common/ScreenHeader'
import { FlatList, StyleSheet } from 'react-native'

import { Text, View } from '../components/Themed'
import { Follow, RootStackScreenProps } from '../types'

export default function AccountList({
  navigation,
}: RootStackScreenProps<'AccountList'>) {
  const { params } = useRoute()
  const title = (params as any)?.title as string
  const list = (params as any)?.accounts as Follow[]

  return (
    <View style={styles.container}>
      <ScreenHeader title={`${title}`} />
      <FlatList
        data={list}
        renderItem={({ item }) => {
          return <AccountItem pubkey={item.pubkey} />
        }}
      />
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
