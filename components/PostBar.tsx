import {
  ChatBubbleEmpty,
  Heart,
  Message,
  Quote,
  RefreshDouble,
  ShareIos,
} from 'iconoir-react-native'
import { Event } from 'nostr-tools'
import { StyleSheet } from 'react-native'
import { View } from './Themed'

export default function PostBar({ post }: { post: Event }) {
  const size = 20
  return (
    <View style={styles.wrap}>
      <View style={styles.item}>
        <Heart width={size} height={size} color="#999" />
      </View>
      <View style={styles.item}>
        <ChatBubbleEmpty width={size} height={size} color="#999" />
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
    marginTop: 6,
    borderTopColor: '#999',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
  },
})
