import Controller from './controller'
import {Mutation, MutationUpdateScriptArgs, Query, QueryChaptersArgs, QuerySingleSerieArgs } from '../generated/graphql'
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
                    chapterId: ws.chapter_id,
                    translation: ws.primary_translation,
                    transcription: ws.transcription, 
                    levelOfKnowledge: ws.number_of_tests,
                    numberOfTests: ws.knowledge_level,              
                   })),
                }))
            }
            else {
                throw Error(res.err);
            }
        },(args) => args.headers.authorization)
        this.createQueryResolver('chapters', async (args: QueryChaptersArgs) => {
            const requestId = v4();
            const res =  await appStore.hook('loadChaptersOfStamps', 'start', 'done', {
                requestId,
                input: args.input.chapterIds
            })
            if(res.ok) {
                return res.data.map(d => ({
                    'audioUrl': d.audio_url,
                    'chapterContent': d.chapter_content,
                    'chapterId': d.chapter_id,
                    'serieId': d.serie_id,
                    'isTop': d.is_top
                }))
            }
            else {
                throw Error(res.err);
            }
        },(args) => args.headers.authorization)
    }
}


export default new WordStampController()