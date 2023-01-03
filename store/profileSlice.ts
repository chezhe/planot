import { createSlice } from '@reduxjs/toolkit'
import { Profile } from '../types'

interface ProfileSlice {
  [key: string]: Profile
}

const initialState: ProfileSlice = {}

export const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    addProfile: (state, action) => {
      const { id, profile } = action.payload
      state[id] = profile
    },
  },
})

export default profileSlice.reducer
