import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { _Series, _WordStamps } from "../../__boostorm/entities";
import { CreateWordStampInput, IWordStampTriggers } from "../wordStamps.module";
import { IState, ITriggers } from "../../_redux/types";
import { OrderBy } from "../../__boostorm";
import { rootRep } from "../../repository";
import { WordStampErorrs } from "../wordStamps.error";
import appStore from "../../_redux/app-store";
import { _LoadGroupedWordStamps } from "../dto/_loadGroupedWordStamps";

export class SaveWordStampService {
    constructor(private opts: ScriptOptsType<IWordStampTriggers, ITriggers, IState, 'saveWordStamp'>) {}
    private requestId: string;
    private data: number = null;
    private err: string = null;

    private endError(err: string) {
        this.opts.setStatus('done', {
            data: null,
            'err': err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err)
        })
        this.opts.drop()
    }

    private endSuccess(data: number) {
        this.opts.setStatus('done', {
            data: data,
            'err': this.err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err)
        })
        this.opts.drop()
    }


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
            this.opts.setStatus('done', {
                'ok': false,
                requestId: this.requestId,
                'err': res.err,
                data: null,
            })
            this.opts.drop();
        }

        return res;
    }

    public async init(args: ScriptInitArgsType<IWordStampTriggers, 'saveWordStamp', 'start'>) {
        this.requestId = args.requestId;
        const authRes = await this.check(args.sessionId);
        if(!authRes.data) {
            this.endError('WRONG_SESION');
            return
        }

        try {
            const res  = await this.saveWordStamp(args.input, authRes.data.user_uuid);
            if(res) {
                this.data = res.word_stamp_id;
            }
            else {
                this.err = WordStampErorrs.WORD_STAMP_SYSTEM_ERR
            }
        } catch (err) {
            this.endError(WordStampErorrs.WORD_STAMP_SYSTEM_ERR) 
            return
        } finally {
            this.opts.setStatus('done', {
                data: this.data,
                ok: !Boolean(this.err),
                err: this.err,
                requestId: this.requestId
            })
            this.opts.drop();
        }
    } 
}