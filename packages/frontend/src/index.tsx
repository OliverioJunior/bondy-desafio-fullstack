import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import { AuthProvider } from './contexts/useAuthContext'
import { AppRouter } from './provider/route'
import './styles/global.css'
import client from './lib/apollo'

// eslint-disable-next-line no-undef
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
)
