/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Event } from 'nostr-tools'
import { ImageSourcePropType } from 'react-native'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined
  Account: { pubkey: string }
  HashTag: { tag: string }
  Modal: undefined
  Note: { note: Event }
  Start: undefined
  Login: undefined
  SignUp: undefined
  AccountEdit: undefined
  NotFound: undefined
  PostNote: { post?: Event }
  RelayManage: undefined
  Search: undefined
  AddRelay: undefined
  AccountList: { title: string; accounts: Follow[] }
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>

export type RootTabParamList = {
  Home: undefined
  Messages: undefined
  Settings: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >

export interface Profile {
  name: string
  picture: string
  about: string
  nip05: string
}

export type PreviewOfURL = {
  url: string
  title?: string
  siteName?: string | undefined
  description?: string | undefined
  mediaType: string
  contentType: string | undefined
  images?: string[]
  videos?: {
    url: string | undefined
    secureUrl: string | null | undefined
    type: string | null | undefined
    width: string | undefined
    height: string | undefined
  }[]
  favicons: string[]
}

export enum ButtonType {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  DANGER = 'danger',
}

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastPayload {
  type: ToastType
  message: string
  icon?: ImageSourcePropType
  duration: number
}

export enum PUB {
  TOAST_MESSAGE = 'TOAST_MESSAGE',
  TOAST_HIDE = 'TOAST_HIDE',
}

export interface SettingItem {
  icon: any
  title: string
  value?: any
  noChevron?: boolean
  onPress: () => void
}

export interface Follow {
  tag: string
  pubkey: string
  relay: string
  name?: string
}

export interface RelayItem {
  relay: string
  permission: {
    write: boolean
    read: boolean
  }
}
