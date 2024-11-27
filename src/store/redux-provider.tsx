'use client'
import { Provider } from 'react-redux'
import store, { persistor } from '../store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from '@/lib/theme-provider'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>{children}</ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default Providers
