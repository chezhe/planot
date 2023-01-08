import ListEmpty from 'components/common/LisstEmpty'
import ScreenHeader from 'components/common/ScreenHeader'
import { useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { View } from '../components/Themed'

export default function Messages() {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <View style={styles.container}>
      <ScreenHeader title="Messages" isBackable={false} />
      <FlatList
        data={[]}
        renderItem={() => {
          return null
        }}
        ListEmptyComponent={
          <ListEmpty isLoading={isLoading} title="No messages yet" />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {},
})
