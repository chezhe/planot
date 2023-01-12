import 'expo-dev-client'
import 'react-native-get-random-values'
import 'fastestsmallesttextencoderdecoder'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { polyfillWebCrypto } from 'expo-standard-web-crypto'

import useCachedResources from './hooks/useCachedResources'
import Navigation from './navigation'
import { store, persistor } from './store/index'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ToastMessage from 'components/common/ToastMessage'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

polyfillWebCrypto()

export default function App() {
  const isLoadingComplete = useCachedResources()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
              <Navigation />
              <StatusBar />
              <ToastMessage />
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    )
  }
}
