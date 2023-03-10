import { Text, View } from 'components/Themed'
import { CircleFade } from 'react-native-animated-spinkit'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'
import FastImage from 'react-native-fast-image'

export default function ListEmpty({
  isLoading,
  title,
}: {
  isLoading: boolean
  title?: string
}) {
  return isLoading ? (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
      }}
    >
      <CircleFade size={100} color="#999" />
    </View>
  ) : (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
      }}
    >
      <FastImage
        source={require('../../assets/images/empty.png')}
        style={{ width: 160, height: 160 }}
      />
      <Text
        style={{
          fontSize: 20,
          marginTop: 10,
          fontFamily: Fonts.variable,
          color: Colors.gray9,
        }}
      >
        {title}
      </Text>
    </View>
  )
}
