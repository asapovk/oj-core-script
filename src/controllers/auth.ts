import Controller from './controller'
import {Mutation, MutationUpdateScriptArgs, Query, QueryAuthenticateArgs, QuerySingleSerieArgs } from '../generated/graphql'
import appStore from '../_redux/app-store'
import {v4} from 'uuid'

class AuthController extends Controller {
    makeMutation = (m: Mutation) => {

    }
    makeQuery = (q: Query) => {
        this.createQueryResolver('authenticate', async (args: QueryAuthenticateArgs, auth: string) => {
            const requestId = v4();
            const res =  await appStore.hook('authenticateLink', 'start', 'done', {
                requestId,
                input: {
                    'link_session': auth,
                    'link_value': args.input.link,
                    'serieId': args.input.serieId,
                },
            })
            if(res.ok) {
                return {
                    session: res.data.session_value
                }
            }
            else {
                throw Error(res.err)
            }
        },(args) => args.headers.authorization)
    }
}


export default new AuthController()