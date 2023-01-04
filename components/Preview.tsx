import {
  Image,
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

export default function Preview({
  preview,
}: {
  preview: PreviewOfURL | undefined
}) {
  const theme = useColorScheme()
  const { width } = useWindowDimensions()

  const contentWidth = width - 20 - 50 - 8 - 20

  const [imageHeight, setImageHeight] = useState<number>(contentWidth)

  useEffect(() => {
    if (preview && preview.mediaType === 'image') {
      Image.getSize(preview.url, (width, height) => {
        if (width !== 0 && height !== 0) {
          setImageHeight((height * (contentWidth - 2)) / width)
        }
      })
    }
  }, [preview])

  if (!preview) {
    return null
  }

  return (
    <>
      {preview && preview.contentType === 'text/html' && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => WebBrowser.openBrowserAsync(preview.url)}
        >
          <View
            style={[
              styles.previewWrap,
              {
                backgroundColor: Colors[theme].background,
                borderColor: Colors[theme].borderColor,
                width: contentWidth,
              },
            ]}
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
            {preview.images && preview.images.length > 0 && (
              <Image
                source={{ uri: preview.images[0] }}
                style={[styles.previewImage, { width: contentWidth - 2 }]}
                resizeMode="cover"
              />
            )}
          </View>
        </TouchableOpacity>
      )}
      {preview && preview.mediaType === 'image' && (
        <Image
          source={{ uri: preview.url }}
          style={[
            styles.previewImage,
            { width: contentWidth - 2, height: imageHeight },
          ]}
          resizeMode="cover"
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
    <Image
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
    height: 100,
    marginTop: 8,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
})
