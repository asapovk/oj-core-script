import Controller from './controller'
import {Mutation, MutationUpdateScriptArgs, Query, QueryAuthenticateArgs, QuerySingleSerieArgs } from '../generated/graphql'
import appStore from '../_redux/app-store'
import {v4} from 'uuid'

class AuthController extends Controller {
    makeMutation = (m: Mutation) => {

    }
    makeQuery = (q: Query) => {
        this.createQueryResolver('authenticate', async (args: QueryAuthenticateArgs, auth: string) => {

            return {
                session: '1'
            }

        },(args) => args.headers.authorization)
    }
}


export default new AuthController()