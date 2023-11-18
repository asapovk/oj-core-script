import Controller from './controller'
import {Mutation, MutationUpdateScriptArgs, Query, QuerySingleSerieArgs } from '../generated/graphql'
import appStore from '../_redux/app-store'
import {v4} from 'uuid'

class WordStampController extends Controller {
    makeMutation = (m: Mutation) => {

    }
    makeQuery = (q: Query) => {
        this.createQueryResolver('loadGroupedWordStamps', async (args: {}, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('loadGroupedWordStamps', 'start', 'done', {
                requestId,
                sessionId: auth
            })
            if(res.ok) {
                return res.data.map(d => ({
                   'moviedId': d.seriesMovieId,
                   'serieId': d.seriesSerieId,
                   'title': d.seriesTitle,
                   wordStamps: d.seriesWordStamps.map( ws => ({
                    wordStampId: ws.word_stamp_id,
                    writing: ws.writing,
                    kana: ws.kana,
                    translation: ws.primary_translation,
                    transcription: ws.transcription,                
                   })),
                }))
            }
            else {
                throw Error(res.err);
            }
        },(args) => args.headers.authorization)
    }
}


export default new WordStampController()