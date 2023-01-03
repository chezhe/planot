import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import settingSlice from './settingSlice'
import profileSlice from './profileSlice'
import accountSlice from './accountSlice'

const persistConfig = {
  key: 'Planot',
  storage: AsyncStorage,
}

const rootReducer = combineReducers({
  setting: settingSlice,
  profile: profileSlice,
  account: accountSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
