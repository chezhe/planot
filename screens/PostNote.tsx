import { useRoute } from '@react-navigation/native'
import Box from 'components/common/Box'
import Button from 'components/common/Button'
import Post from 'components/Post'
import useColorScheme from 'hooks/useColorScheme'
import { Cancel } from 'iconoir-react-native'
import { Event } from 'nostr-tools'
import { useState } from 'react'
import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import Colors from 'theme/Colors'

import { Text, View } from '../components/Themed'
import { RootStackScreenProps } from '../types'

export default function PostNote({
  navigation,
}: RootStackScreenProps<'PostNote'>) {
  const [content, setContent] = useState('')
  const theme = useColorScheme()
  const { params } = useRoute()
  const post = (params as any)?.post as Event | undefined
  function onPost() {}
  return (
    <View style={styles.container}>
      <Box
        direction="row"
        align="center"
        justify="space-between"
        pad="medium"
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: Colors[theme].borderColor,
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Cancel width={32} height={32} color={Colors[theme].text} />
        </Pressable>

        <Button
          label="Post"
          primary
          size="small"
          filled={false}
          disabled={!content}
          onPress={onPost}
          style={{ width: 100 }}
        />
      </Box>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={(text) => setContent(text)}
        multiline
        autoFocus
      />
      {post && <Post post={post} onlyRenderSelf />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    lineHeight: 24,
    maxHeight: 300,
  },
})
