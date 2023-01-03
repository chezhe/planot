import { createSlice } from '@reduxjs/toolkit'

interface SettingSlice {
  bioAuthEnabled: boolean
  theme: string
  pushToken: string
  isDevMode: boolean
}

const initialState: SettingSlice = {
  bioAuthEnabled: false,
  theme: 'auto',
  pushToken: '',
  isDevMode: false,
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
  },
})

export const { updateTheme, updatePushToken, updateDevMode } =
  settingSlice.actions

export default settingSlice.reducer
