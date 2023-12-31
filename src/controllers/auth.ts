import Controller from './controller'
import {Mutation, MutationCreatePublicLinkArgs, MutationUpdateScriptArgs, Query, QueryAuthenticateArgs, QuerySignInArgs, QuerySingleSerieArgs } from '../generated/graphql'
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
                    'serieId': args.input.serieId,
                    'groupId': 1
                }
            })
            return {
                'data': res.ok ? res.data.id_public_link: null,
                errorCode: res.err
            }
        }, (args) => args.headers.authorization)
    }
    makeQuery = (q: Query) => {
        this.createQueryResolver('checkSession', async ({}, auth: string) => {
            const requestId = v4();
            const res =  await appStore.hook('checkSession', 'start', 'done', {
                requestId,
                input: {
                  'sessionToken':  auth
                },
            })
            return  res.data
        }, (args) => args.headers.authorization)
        this.createQueryResolver('authenticate', async (args: QueryAuthenticateArgs, auth: string) => {
            const requestId = v4();
            const res =  await appStore.hook('authenticateLink', 'start', 'done', {
                requestId,
                input: {
                    'sessionValue': auth,
                    'link_value': args.input.link,
                },
            })
                return {
                    session:   res.data ? res.data.publicLinkSessionSessionValue:  null,
                    data:  res.ok ? {
                        'end': res.data.publicLinkEndSecond,
                        'start': res.data.publicLinkStartSecond,
                        'linkValue': '1',
                        'serieId': res.data.publicLinkIdSerie,
                    }: null,
                    errorCode: res.err,
                    'isMaster': res.data ? res.data.isMaster: null, 
                }
            
        },(args) => args.headers.authorization)
        this.createQueryResolver('signIn', async (args: QuerySignInArgs) => {
            const requestId = v4();
            const res =  await appStore.hook('signIn', 'start', 'done', {
                requestId,
                input: {
                    'login': args.input.login,
                    'password': args.input.password,
                },
            })
                return {
                    session: res.ok ? res.data.sessionsSessionUuid: null,
                    errorCode: res.err
                }
            
        })
    }
}


export default new AuthController()