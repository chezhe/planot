import { createSlice } from '@reduxjs/toolkit'
import { Follow } from 'types'

interface AccountSlice {
  privkey: string
  pubkey: string
  following: Follow[]
}

const initialState: AccountSlice = {
  privkey: 'dd21d1593f30448180949feb472bba3e943b25b22e4f6aa55490c1664227d751',
  pubkey: 'fd526aaff431de56fdd52688d88ca65d27ae547e686b21fda4b2d1177cefb4f4',
  following: [],
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    login: (state, action) => {
      state.privkey = action.payload.privkey
      state.pubkey = action.payload.pubkey
    },
    updateFollowing: (state, action) => {
      state.following = action.payload
    },
  },
})

export default accountSlice.reducer
