import Controller from './controller'
import {Mutation, MutationUpdateScriptArgs, Query, QuerySingleSerieArgs } from '../generated/graphql'
import appStore from '../_redux/app-store'
import {v4} from 'uuid'

class AuthController extends Controller {
    makeMutation = (m: Mutation) => {
        this.createMutationResolver('updateScript', async (args: MutationUpdateScriptArgs, auth: any) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('updateScript', 'init', 'done', {
                requestId,
                data: {
                    sessionId: auth,
                    input: {
                        'script': args.input.body,
                        serie_id: args.input.serieId,
                    }
                }
            })
            if(res.ok) {
                return true
            }
            else {
                throw Error(res.err)
            }
        }, (args) => args.headers.authorization)
    }
    makeQuery = (q: Query) => {
        this.createQueryResolver('singleSerie', async (args: QuerySingleSerieArgs, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('loadSerie', 'init', 'done', {
                requestId,
                data: {
                    serie_id: args.input.serieId
                }

            })
            if(res.ok) {
                return [{
                    'title': res.data.title,
                    'description': res.data.description,
                    'serieId': res.data.serie_id,
                    'movieId': res.data.movie_id,
                    'isScriptVerified': true,
                    'likes': 0,
                    'views': 0,
                    script: res.data.script ? JSON.stringify(res.data.script): null,
                    'videoUrl': res.data.video_url,
                }];
            }
            else {
                throw Error(res.err);
            }
        },(args) => args.headers.authorization)
    }
}


export default new AuthController()