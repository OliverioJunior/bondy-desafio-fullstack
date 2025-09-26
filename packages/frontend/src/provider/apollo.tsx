import React, { ReactNode } from 'react'
import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react'
import client from '../lib/apollo'

interface ApolloProviderProps {
  children: ReactNode
}

export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>
}
