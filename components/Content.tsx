import { useNavigation } from '@react-navigation/native'
import { Linking, StyleSheet } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import Colors from 'theme/Colors'
import { Text } from './Themed'

const PATTERN_HASHTAG = /(^|\s)(#[a-z\d-_]+)/gi
const PATTERN_MENTION = /(^|\s)(@[a-z\d-_]+)/gi
const PATTERN_EMAIL = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
const PATTERN_URL =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

interface Pattern {
  regexp: RegExp
  name: string
}

const PATTERNS: Pattern[] = [
  {
    regexp: PATTERN_HASHTAG,
    name: 'hashtag',
  },
  {
    regexp: PATTERN_MENTION,
    name: 'mention',
  },
  {
    regexp: PATTERN_EMAIL,
    name: 'email',
  },
  {
    regexp: PATTERN_URL,
    name: 'url',
  },
]

const matchesWith = (str: string, pattern: Pattern) => {
  let match = null
  const arr = []
  while ((match = pattern.regexp.exec(str)) != null) {
    arr.push([match, pattern])
  }
  return arr
}

const splitStringByMatches = (
  str: string,
  matches: [RegExpExecArray, Pattern][]
) => {
  const arr: [string, Pattern | null][] = []
  let o = 0

  matches.forEach(([match, pattern]: [any, Pattern]) => {
    const index = match.index
    const text = match[match.length - 1]
    arr.push([str.slice(o, index), null])
    arr.push([str.slice(index, index + text.length + 1), pattern])
    o = index + text.length + 1
  })

  arr.push([str.slice(o, str.length), null])

  return arr.filter(([s]: any) => s.length > 0)
}

export default function Content({ content }: { content: string }) {
  const matches = []
    .concat(...PATTERNS.map((pattern) => matchesWith(content, pattern)))
    .filter((e) => !!e.length)
    .sort(([a], [b]) => ({ ...a }.index - { ...b }.index))

  const navigation = useNavigation()

  const onPress = async (str: string, pattern: Pattern) => {
    if (pattern.name === 'hashtag') {
      const tag = str.trim().split('#')[1]
      navigation.navigate('HashTag', { tag })
    } else if (pattern.name === 'mention') {
      const pubkey = str.trim().split('@')[1]
      navigation.navigate('Account', { pubkey })
    } else if (pattern.name === 'email') {
      await Linking.openURL(`mailto:${str.trim()}`)
    } else if (pattern.name === 'url') {
      await WebBrowser.openBrowserAsync(str.trim())
    }
  }

  return (
    <Text style={{ fontSize: 18, marginTop: 4 }}>
      {splitStringByMatches(content, matches).map(([str, pattern], i) => {
        return (
          <Text
            key={i}
            onPress={
              pattern
                ? (e) => {
                    onPress(str, pattern)
                  }
                : undefined
            }
            style={pattern ? [styles.patternStyle] : {}}
            children={str}
          />
        )
      })}
    </Text>
  )
}

const styles = StyleSheet.create({
  linkStyle: {
    color: Colors.link,
  },
  patternStyle: {
    color: Colors.link,
  },
})
