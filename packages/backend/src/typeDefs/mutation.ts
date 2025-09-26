import gql from 'graphql-tag'

export default gql`
  type Mutation {
    mutationTest(test: Boolean): Boolean
    login(email: String!, password: String!): LoginResponse
  }

  type LoginResponse {
    token: String!
    user: User!
  }

  type User {
    id: String!
    name: String!
    email: String!
    company: String
  }
`
