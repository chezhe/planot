import Box from 'components/common/Box'
import Button from 'components/common/Button'
import Heading from 'components/common/Heading'
import Icon from 'components/common/Icon'
import ScreenHeader from 'components/common/ScreenHeader'
import useColorScheme from 'hooks/useColorScheme'
import {
  AddCircledOutline,
  DataTransferBoth,
  DataTransferDown,
  DataTransferUp,
  DataTransferWarning,
  DeleteCircledOutline,
  Plus,
} from 'iconoir-react-native'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Colors from 'theme/Colors'
import Fonts from 'theme/Fonts'

import { Text, View } from '../components/Themed'
import { RelayItem, RootStackScreenProps } from '../types'

function RelayStatus({
  permission,
}: {
  permission: { write: boolean; read: boolean }
}) {
  const size = 30
  const color = Colors.gray9
  if (permission.write && permission.read) {
    return <DataTransferBoth width={size} height={size} color={color} />
  }
  if (permission.write && !permission.read) {
    return <DataTransferUp width={size} height={size} color={color} />
  }
  if (!permission.write && permission.read) {
    return <DataTransferDown width={size} height={size} color={color} />
  }
  if (!permission.write && !permission.read) {
    return <DataTransferWarning width={size} height={size} color={color} />
  }

  return null
}

export default function RelayManage({
  navigation,
}: RootStackScreenProps<'RelayManage'>) {
  const relays = useAppSelector((state) => state.setting.relays)
  const theme = useColorScheme()
  const { width } = useWindowDimensions()

  const dispatch = useAppDispatch()

  const onUpdateRelay = (relay: RelayItem) => {
    dispatch({
      type: 'setting/updateRelay',
      payload: relay,
    })
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Relays"
        rightEle={
          <Icon
            size={30}
            icon={<Plus width={30} height={30} color={Colors.white} />}
            onPress={() => navigation.navigate('AddRelay')}
          />
        }
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 20 }}
      >
        <Box direction="column" full gap="medium" style={{ marginTop: 10 }}>
          {relays.map((relay) => {
            return (
              <View
                key={relay.relay}
                style={[
                  styles.item,
                  {
                    backgroundColor: Colors[theme].cardBackground,
                  },
                ]}
              >
                <Box direction="row" gap="small">
                  <RelayStatus permission={relay.permission} />
                  <Text
                    style={[styles.relayUrl, { maxWidth: width - 120 }]}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {relay.relay}
                  </Text>
                </Box>
                <View style={styles.divider} />
                <Box direction="row" gap="small" justify="space-between">
                  <Box direction="row" align="center" gap="small">
                    <Text>Write</Text>
                    <Switch
                      value={relay.permission.write}
                      onChange={() => {
                        onUpdateRelay({
                          relay: relay.relay,
                          permission: {
                            ...relay.permission,
                            write: !relay.permission.write,
                          },
                        })
                      }}
                    />
                  </Box>
                  <Box direction="row" align="center" gap="small">
                    <Text>Read</Text>
                    <Switch
                      value={relay.permission.read}
                      onChange={() => {
                        onUpdateRelay({
                          relay: relay.relay,
                          permission: {
                            ...relay.permission,
                            read: !relay.permission.read,
                          },
                        })
                      }}
                    />
                  </Box>

                  <Pressable
                    onPress={() => {
                      dispatch({
                        type: 'setting/removeRelay',
                        payload: relay,
                      })
                    }}
                  >
                    <DeleteCircledOutline
                      width={30}
                      height={30}
                      color={Colors.gray9}
                    />
                  </Pressable>
                </Box>
              </View>
            )
          })}
        </Box>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  relayUrl: {
    color: Colors.link,
    fontFamily: Fonts.variable,
    fontSize: 18,
  },
  item: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray9,
    marginVertical: 6,
  },
})
