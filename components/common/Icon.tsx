import { StyleSheet, Pressable } from 'react-native'
import Colors from 'theme/Colors'
import useColorScheme from 'hooks/useColorScheme'

export default function Icon({
  backgroundColor,
  onPress,
  size = 50,
  icon = null,
  style = {},
}: {
  backgroundColor?: string
  size?: number
  onPress?: () => void
  isTransparent?: boolean
  icon?: any
  style?: any
}) {
  const theme = useColorScheme()

  if (!onPress) {
    return icon
  }
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor || Colors[theme].link,
        },
        {
          width: size,
          height: size,
        },
        style,
      ]}
      onPress={onPress}
    >
      {icon}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
