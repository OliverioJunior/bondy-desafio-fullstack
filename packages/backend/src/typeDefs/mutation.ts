import gql from 'graphql-tag'

export default gql`
  type Mutation {
    mutationTest(test: Boolean): Boolean
    login(email: String!, password: String!): LoginResponse

    type LoginResponse {
    id: String
    name: String
    email: String
    company: String
    }
  }
`
