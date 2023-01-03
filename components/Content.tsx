import { useNavigation } from '@react-navigation/native'
import Colors from 'theme/Colors'
import { Text } from './Themed'

export default function Content({ content }: { content: string }) {
  const hashTags = content.match(/#[\p{L}]+/giu)
  const navigation = useNavigation()
  return (
    <Text style={{ fontSize: 18, marginTop: 4 }}>
      {content.split('#').map((text, index) => {
        if (hashTags?.includes(`#${text}`)) {
          return (
            <Text
              key={index}
              style={{ color: Colors.link }}
              onPress={() => navigation.navigate('HashTag', { tag: text })}
            >
              #{text}
            </Text>
          )
        }
        return <Text key={index}>{text}</Text>
      })}
    </Text>
  )
}
