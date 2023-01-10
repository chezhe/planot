import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import Colors from 'theme/Colors'
import { PreviewOfURL } from 'types'
import { Text, View } from './Themed'
import * as WebBrowser from 'expo-web-browser'
import useColorScheme from 'hooks/useColorScheme'
import Fonts from 'theme/Fonts'
import { useEffect, useState } from 'react'
import { Video, ResizeMode } from 'expo-av'
import FastImage from 'react-native-fast-image'

export default function Preview({
  preview,
  isRoot,
}: {
  preview: PreviewOfURL | undefined
  isRoot?: boolean
}) {
  const theme = useColorScheme()
  const { width } = useWindowDimensions()

  const contentWidth = width - 20 - 50 - 8 - 20 - 6

  const [imageHeight, setImageHeight] = useState<number>(contentWidth)

  useEffect(() => {
    if (preview && preview.mediaType === 'image') {
      Image.getSize(preview.url, (width, height) => {
        if (width !== 0 && height !== 0) {
          setImageHeight((height * (contentWidth - 2)) / width)
        }
      })
    }
  }, [preview?.mediaType])

  if (!preview) {
    return null
  }

  let digest = null
  if (preview && preview.contentType === 'text/html') {
    const withImage = preview.images && preview.images.length > 0
    digest = (
      <View
        style={{
          backgroundColor: Colors[theme].bannerBackground,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          paddingTop: 10,
          borderRadius: withImage ? undefined : 8,
        }}
      >
        <View style={styles.row}>
          {preview.favicons && preview.favicons.length > 0 && (
            <Favicon favicons={preview.favicons} />
          )}
          <Text
            style={[
              styles.previewTitle,
              {
                maxWidth: contentWidth - 50,
              },
            ]}
            numberOfLines={1}
          >
            {preview.title}
          </Text>
        </View>
        <Text
          style={[
            styles.previewDesc,
            {
              marginBottom: 10,
            },
          ]}
          numberOfLines={2}
        >
          {preview.description}
        </Text>
      </View>
    )
  }
  return (
    <>
      {preview && preview.contentType === 'text/html' && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => WebBrowser.openBrowserAsync(preview.url)}
        >
          {preview.images && preview.images.length > 0 ? (
            <ImageBackground
              source={{ uri: preview.images[0] }}
              style={[
                styles.previewImage,
                { width: contentWidth - (isRoot ? 2 : 12) },
              ]}
              resizeMode="cover"
              imageStyle={{ borderRadius: 8 }}
            >
              {digest}
            </ImageBackground>
          ) : (
            digest
          )}
        </TouchableOpacity>
      )}
      {preview && preview.mediaType === 'image' && (
        <FastImage
          source={{ uri: preview.url }}
          style={[
            styles.previewImage,
            { width: contentWidth - (isRoot ? 2 : 12), height: imageHeight },
          ]}
          resizeMode="cover"
        />
      )}
      {preview && preview.mediaType === 'video' && (
        <Video
          style={{ width: contentWidth - 2 }}
          source={{
            uri: preview.url,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={(status) => {}}
        />
      )}
    </>
  )
}

function Favicon({ favicons }: { favicons: string[] | undefined }) {
  let url = ''
  if (!favicons) {
    return null
  }
  if (favicons.length > 0) {
    const supported = favicons.find(
      (t) =>
        t.includes('.png') ||
        t.includes('.jpg') ||
        t.includes('.jpeg') ||
        t.includes('.webp')
    )
    if (supported) {
      url = supported
    }
  }
  if (!url) {
    return null
  }
  return (
    <FastImage
      source={{ uri: url }}
      style={{ width: 20, height: 20, marginRight: 10 }}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  previewWrap: {
    borderRadius: 8,
    paddingTop: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  previewTitle: {
    fontSize: 20,
    fontFamily: Fonts.heading,
  },
  previewDesc: {
    fontSize: 16,
    marginHorizontal: 10,
    opacity: 0.7,
  },
  previewImage: {
    height: 160,
    marginTop: 8,
  },
})
