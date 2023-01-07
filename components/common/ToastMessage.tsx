import { Text } from 'components/Themed'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  ImageSourcePropType,
  useWindowDimensions,
  Image,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'
import { PUB, ToastPayload, ToastType } from 'types'
import Box from './Box'

const BG_COLORS = {
  error: Colors.red,
  success: Colors.green,
  info: Colors.purple,
  warning: Colors.yellow,
}

export default function ToastMessage() {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const [message, setMessage] = useState('')
  const [type, setType] = useState<ToastType>('info')
  const [icon, setIcon] = useState<ImageSourcePropType>()
  const phPosY = useRef(new Animated.Value(-100)).current

  useEffect(() => {
    const onClose = () => {
      Animated.parallel([
        Animated.timing(phPosY, {
          toValue: -100,
          duration: 200,
          easing: Easing.poly(1),
          useNativeDriver: true,
        }),
      ]).start()
      setTimeout(() => {
        setMessage('')
        setIcon(undefined)
      }, 200)
    }

    const onMessage = (
      msg: string,
      { type, message, duration, icon }: ToastPayload
    ) => {
      setType(type)
      setMessage(message)
      setIcon(icon)
      Animated.parallel([
        Animated.timing(phPosY, {
          toValue: 0,
          duration: 200,
          easing: Easing.poly(1),
          useNativeDriver: true,
        }),
      ]).start()

      setTimeout(onClose, duration)
    }
    const onMessageTick = PubSub.subscribe(PUB.TOAST_MESSAGE, onMessage)
    const onHideTick = PubSub.subscribe(PUB.TOAST_HIDE, onClose)
    return () => {
      onMessageTick && PubSub.unsubscribe(onMessageTick)
      onHideTick && PubSub.unsubscribe(onHideTick)
    }
  }, [])

  if (!message) {
    return null
  }

  return (
    <Animated.View
      style={{
        paddingTop: insets.top,
        paddingBottom: 10,
        backgroundColor: BG_COLORS[type],
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        zIndex: 10000,
        transform: [
          {
            translateY: phPosY,
          },
        ],
      }}
    >
      <Box align="center" justify="center" style={{ paddingHorizontal: 20 }}>
        {icon && (
          <Image
            source={icon}
            style={{ width: 30, height: 30, marginRight: 10, borderRadius: 4 }}
            resizeMode="cover"
          />
        )}
        <Text
          style={{
            color: type === 'warning' ? Colors.black : Colors.white,
            fontSize: 18,
            fontFamily: Fonts.heading,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      </Box>
    </Animated.View>
  )
}
