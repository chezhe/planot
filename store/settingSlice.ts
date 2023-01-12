import { createSlice } from '@reduxjs/toolkit'
import { RelayItem } from 'types'

interface SettingSlice {
  bioAuthEnabled: boolean
  theme: string
  pushToken: string
  isDevMode: boolean
  relays: RelayItem[]
}

const initialState: SettingSlice = {
  bioAuthEnabled: false,
  theme: 'auto',
  pushToken: '',
  isDevMode: false,
  relays: [
    {
      relay: 'wss://nostr-pub.wellorder.net',
      permission: {
        write: true,
        read: true,
      },
    },
    {
      relay: 'wss://relay.damus.io',
      permission: {
        write: true,
        read: true,
      },
    },
    {
      relay: 'wss://relay.nostr.ch',
      permission: {
        write: true,
        read: true,
      },
    },
    {
      relay: 'wss://nostr.zebedee.cloud',
      permission: {
        write: true,
        read: true,
      },
    },
  ],
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    updateTheme: (state, action) => {
      state.theme = action.payload
    },
    updatePushToken: (state, action) => {
      state.pushToken = action.payload
    },
    updateDevMode: (state, action) => {
      state.isDevMode = action.payload
    },
    updateRelay: (state, action) => {
      const relay = action.payload
      state.relays = state.relays.map((item) => {
        if (item.relay === relay.relay) {
          return relay
        }
        return item
      })
    },
    removeRelay: (state, action) => {
      const relay = action.payload
      state.relays = state.relays.filter((item) => {
        if (item.relay === relay.relay) {
          return false
        }
        return true
      })
    },
    addRelay: (state, action) => {
      const relay = action.payload
      state.relays = [...state.relays, relay]
    },
  },
})

export const { updateTheme, updatePushToken, updateDevMode } =
  settingSlice.actions

export default settingSlice.reducer
