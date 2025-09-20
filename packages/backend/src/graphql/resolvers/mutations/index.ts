import { GraphQLResolveInfo } from 'graphql'
import { mutationTest } from './mutationTest'

import { LoginArgs } from '../@types/login'
import { login } from './login'
export default {
  mutationTest: (
    parent: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ) => mutationTest(parent, args, context, info),
  login: (
    parent: unknown,
    args: LoginArgs,
    context: any,
    info: GraphQLResolveInfo
  ) => login(parent, args, context, info),
}
