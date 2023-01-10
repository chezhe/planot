import AnimatedInput from 'components/common/AnimatedInput'
import Avatar from 'components/common/Avatar'
import Box from 'components/common/Box'
import Button from 'components/common/Button'
import ScreenHeader from 'components/common/ScreenHeader'
import useColorScheme from 'hooks/useColorScheme'
import _ from 'lodash'
import { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useAppSelector } from 'store/hooks'
import Colors from 'theme/Colors'

import { View } from '../components/Themed'
import { RootStackScreenProps } from '../types'

export default function AccountEdit({
  navigation,
}: RootStackScreenProps<'AccountEdit'>) {
  const { pubkey } = useAppSelector((state) => state.account)
  const profiles = useAppSelector((state) => state.profile)
  const [iprofile, setIProfile] = useState(
    profiles[pubkey] || {
      name: '',
      picture: '',
      about: '',
    }
  )
  const [nameFocus, setNameFocus] = useState(false)
  const [aboutFocus, setAboutFocus] = useState(false)
  const [avatarFocus, setAvatarFocus] = useState(false)
  const theme = useColorScheme()

  let isDisabled = false
  if (_.isEqual(iprofile, profiles[pubkey])) {
    isDisabled = true
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Account" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Box direction="column" gap="large">
          <Box pad="medium" align="center" justify="center">
            <Avatar src={iprofile?.picture} size={100} pubkey={pubkey} />
          </Box>
          <Box
            full
            style={{
              paddingVertical: 4,
              borderBottomWidth: 1,
              borderBottomColor: nameFocus
                ? Colors[theme].text
                : Colors[theme].borderColor,
            }}
          >
            <AnimatedInput
              placeholder="Name"
              value={iprofile.name}
              onChangeText={(_text) =>
                setIProfile({ ...iprofile, name: _text })
              }
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
              placeholderTextColor={Colors.gray9}
              animatedLeft={0}
              maxLength={30}
              autoCorrect={false}
            />
          </Box>

          <Box
            full
            style={{
              paddingVertical: 4,
              borderBottomWidth: 1,
              borderBottomColor: aboutFocus
                ? Colors[theme].text
                : Colors[theme].borderColor,
            }}
          >
            <AnimatedInput
              placeholder="About"
              value={iprofile.about}
              onChangeText={(_text) =>
                setIProfile({ ...iprofile, about: _text })
              }
              onFocus={() => setAboutFocus(true)}
              onBlur={() => setAboutFocus(false)}
              placeholderTextColor={Colors.gray9}
              animatedLeft={0}
              maxLength={30}
              numberOfLines={3}
              autoCorrect={false}
              multiline
            />
          </Box>

          <Box
            full
            style={{
              paddingVertical: 4,
              borderBottomWidth: 1,
              borderBottomColor: avatarFocus
                ? Colors[theme].text
                : Colors[theme].borderColor,
            }}
          >
            <AnimatedInput
              placeholder="Avatar"
              value={iprofile.picture}
              onChangeText={(_text) =>
                setIProfile({ ...iprofile, picture: _text })
              }
              onFocus={() => setAvatarFocus(true)}
              onBlur={() => setAvatarFocus(false)}
              placeholderTextColor={Colors.gray9}
              animatedLeft={0}
              maxLength={30}
              numberOfLines={3}
              autoCorrect={false}
            />
          </Box>

          <Button
            primary
            label="Save"
            disabled={isDisabled}
            onPress={() => {}}
          />
        </Box>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
})
