import { useNavigation } from '@react-navigation/native'
import {
  ChatBubbleEmpty,
  Heart,
  Message,
  Quote,
  RefreshDouble,
  ShareIos,
} from 'iconoir-react-native'
import { Event } from 'nostr-tools'
import { Pressable, StyleSheet } from 'react-native'
import { View } from './Themed'

export default function PostBar({ post }: { post: Event }) {
  const size = 20
  const navigation = useNavigation()
  return (
    <View style={styles.wrap}>
      <View style={styles.item}>
        <Heart width={size} height={size} color="#999" />
      </View>
      <View style={styles.item}>
        <Pressable onPress={() => navigation.navigate('PostNote', { post })}>
          <ChatBubbleEmpty width={size} height={size} color="#999" />
        </Pressable>
      </View>
      <View style={styles.item}>
        <RefreshDouble width={size} height={size} color="#999" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    marginTop: 10,
    borderTopColor: '#999',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
  },
})
