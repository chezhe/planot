import { StyleSheet } from 'react-native'
import Beam from './Beam'
import FastImage, { ImageStyle } from 'react-native-fast-image'

export default function Avatar({
  src,
  pubkey,
  size = 50,
  style = {},
}: {
  src?: string
  pubkey: string
  size?: number
  style?: ImageStyle
}) {
  if (src) {
    return (
      <FastImage
        source={{ uri: src }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: '#999',
          borderWidth: StyleSheet.hairlineWidth,
          ...style,
        }}
      />
    )
  }

  return <Beam name={pubkey} size={size} />
}
