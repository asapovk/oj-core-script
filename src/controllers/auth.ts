import Controller from './controller'
import {Mutation, MutationCreatePublicLinkArgs, MutationUpdateScriptArgs, Query, QueryAuthenticateArgs, QuerySingleSerieArgs } from '../generated/graphql'
import appStore from '../_redux/app-store'
import {v4} from 'uuid'

class AuthController extends Controller {
    makeMutation = (m: Mutation) => {
        this.createMutationResolver('createPublicLink', async (args: MutationCreatePublicLinkArgs, auth: any) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('createPublicLink', 'start', 'done', {
                requestId,
                input: {
                    'start':  args.input.start ? `${args.input.start}`: undefined,
                    'end': args.input.end ? `${args.input.end}`: undefined,
                    'link_value': args.input.linkValue,
                    'serieId': args.input.serieId
                }
            })
            return {
                'data': res.ok ? res.data.id_public_link: null,
                errorCode: res.err
            }
        }, (args) => args.headers.authorization)
    }
    makeQuery = (q: Query) => {
        this.createQueryResolver('authenticate', async (args: QueryAuthenticateArgs, auth: string) => {
            const requestId = v4();
            const res =  await appStore.hook('authenticateLink', 'start', 'done', {
                requestId,
                input: {
                    'link_session': auth,
                    'link_value': args.input.link,
                },
            })
                return {
                    session: res.data.publicLinkSessionSessionValue,
                    data: {
                        'end': res.data.publicLinkEndSecond,
                        'start': res.data.publicLinkStartSecond,
                        'linkValue': '1',
                        'serieId': res.data.publicLinkIdSerie,
                    },
                    errorCode: res.err
                }
            
        },(args) => args.headers.authorization)
    }
}


export default new AuthController()