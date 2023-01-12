import { FlashList } from '@shopify/flash-list'
import Box from 'components/common/Box'
import Button from 'components/common/Button'
import ListEmpty from 'components/common/LisstEmpty'
import useColorScheme from 'hooks/useColorScheme'
import { ArrowLeft, NavArrowLeft } from 'iconoir-react-native'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'
import Toast from 'utils/toast'

import { Text, View } from '../components/Themed'
import { RootStackScreenProps } from '../types'

export default function AddRelay({
  navigation,
}: RootStackScreenProps<'AddRelay'>) {
  const [recommendRelays, setRecommendRelayes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const relays = useAppSelector((state) => state.setting.relays)
  useEffect(() => {
    setIsLoading(true)
    fetch('https://planot.deno.dev/api/relays')
      .then((res) => res.json())
      .then((res) => {
        setRecommendRelayes(res)
        setIsLoading(false)
      })
      .catch((err) => {
        Toast.error(err)
        setIsLoading(false)
      })
  }, [])
  const theme = useColorScheme()
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()

  const onAddRelay = (relay: string) => {
    dispatch({
      type: 'setting/addRelay',
      payload: {
        relay,
        permission: {
          read: true,
          write: true,
        },
      },
    })
  }
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <Box pad="small">
          <NavArrowLeft width={32} height={32} color={Colors[theme].text} />
          <Text style={{ fontSize: 20 }}>Back</Text>
        </Box>
      </Pressable>
      <FlashList
        estimatedItemSize={50}
        data={recommendRelays}
        keyExtractor={(item) => item}
        extraData={relays}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        renderItem={({ item }) => {
          const isAdded = relays.some((t) => t.relay === item)
          return (
            <View
              style={[
                styles.item,
                {
                  backgroundColor: Colors[theme].cardBackground,
                },
              ]}
            >
              <Text style={styles.relayUrl}>{item}</Text>
              <View style={styles.divider} />
              <Box direction="row" align="center" justify="flex-end">
                <Button
                  label={isAdded ? 'Added' : 'Add'}
                  primary={!isAdded}
                  size="small"
                  disabled={isAdded}
                  style={{ width: 100 }}
                  onPress={() => onAddRelay(item)}
                />
              </Box>
            </View>
          )
        }}
        ListEmptyComponent={
          <ListEmpty isLoading={isLoading} title="No relays" />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    borderRadius: 8,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  relayUrl: {
    color: Colors.link,
    fontFamily: Fonts.variable,
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray9,
    marginVertical: 6,
  },
})
