import { FlatList } from 'react-native'
import { Text } from './Themed'

export default function Feed() {
  return (
    <FlatList
      data={[]}
      renderItem={({ item }) => {
        return <Text>{item}</Text>
      }}
    />
  )
}
