/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'

import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import ModalScreen from '../screens/ModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import Home from '../screens/Home'
import SettingsScreen from '../screens/Settings'
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from '../types'
import LinkingConfiguration from './LinkingConfiguration'
import {
  HomeAlt,
  Mail,
  MailOpened,
  Home as HomeEmpty,
  Settings,
} from 'iconoir-react-native'
import Account from '../screens/Account'
import Messages from '../screens/Messages'

export default function Navigation() {
  const colorScheme = useColorScheme()

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{ title: 'Oops!' }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={({ navigation }: RootTabScreenProps<'Home'>) => {
          return {
            tabBarIcon: ({
              color,
              focused,
            }: {
              color: string
              focused: boolean
            }) => {
              return focused ? (
                <HomeAlt width={30} height={30} strokeWidth={1} />
              ) : (
                <HomeEmpty width={30} height={30} strokeWidth={1} />
              )
            },
            headerShown: false,
            title: 'Home',
          }
        }}
      />
      <BottomTab.Screen
        name="Messages"
        component={Messages}
        options={({ navigation }: RootTabScreenProps<'Messages'>) => {
          return {
            tabBarIcon: ({
              color,
              focused,
            }: {
              color: string
              focused: boolean
            }) => {
              return focused ? (
                <MailOpened width={30} height={30} strokeWidth={1} />
              ) : (
                <Mail width={30} height={30} strokeWidth={1} />
              )
            },
            headerShown: false,
            title: 'Message',
          }
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }: RootTabScreenProps<'Settings'>) => {
          return {
            tabBarIcon: ({
              color,
              focused,
            }: {
              color: string
              focused: boolean
            }) => {
              return (
                <Settings
                  width={30}
                  height={30}
                  strokeWidth={focused ? 2 : 1}
                />
              )
            },
            headerShown: false,
            title: 'Settings',
          }
        }}
      />
    </BottomTab.Navigator>
  )
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />
}
