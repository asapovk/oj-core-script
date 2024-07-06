import { ScriptOptsType } from "@reflexio/core-v1/lib/types";
import { _Series, _WordStamps } from "../../__boostorm/entities";
import { CreateWordStampInput, IWordStampTriggers } from "../wordStamps.module";
import { IState, ITriggers } from "../../_redux/types";
import { OrderBy } from "../../__boostorm";
import { rootRep } from "../../repository";
import { WordStampErorrs } from "../wordStamps.error";
import appStore from "../../_redux/app-store";
import { _LoadGroupedWordStamps } from "../dto/_loadGroupedWordStamps";
import { ServiceScript } from "../../service-bite/ServiceScript";
import { InitArgsType } from "@reflexio/core-v1/lib/types";

export class SaveWordStampService extends ServiceScript<ITriggers, IState,'saveWordStamp', 'init' > {
    constructor(opts: ScriptOptsType<ITriggers, IState, 'saveWordStamp', 'init'>) {
        super(opts)
    }
    private data: number = null;
    private err: string = null;

    private async saveWordStamp(input: CreateWordStampInput, user_uuid: string): Promise<_WordStamps> {
        return await rootRep.insert({
            'table': 'word_stamps',
            'params': {
                'chapter_id': input.chapterId,
                'kana': input.kana,
                'serie_id': input.serieId,
                writing: input.writing,
                'primary_translation':  input.translation,
                'transcription': input.transcription,
                'hint': null,
                'user_uuid': user_uuid,
                'origin_audio_url': null,
                'female_voice_url': null,
                'orign': 's'
            }
        })
    }

    private async check(sessionId: string) {
        const res = await appStore.hook('getUser', 'start', 'done', {
            'input': {
                'session_uuid': sessionId,
            },
            requestId: this.requestId,
        })
        if(!res.ok) {
            throw new Error(res.err)
        }

        return res;
    }

    public async request (args: InitArgsType<IWordStampTriggers, 'saveWordStamp', 'init'>) {
        this.requestId = args.requestId;
        const authRes = await this.check(args.data.sessionId);
        if(!authRes.data) {
            throw new Error('WRONG_SESION');
        }

        try {
            const res  = await this.saveWordStamp(args.data.input, authRes.data.user_uuid);
            if(res) {
                this.data = res.word_stamp_id;
            }
            else {
                this.err = WordStampErorrs.WORD_STAMP_SYSTEM_ERR
            }
        } catch (err) {
            throw new Error(WordStampErorrs.WORD_STAMP_SYSTEM_ERR) 

        } finally {
            if(this.err) {
                throw new Error(this.err);
            }
            else {
                return this.data
            }
        }
    } 
}