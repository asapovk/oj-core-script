import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { _Series, _WordStamps } from "../../__boostorm/entities";
import { IWordStampTriggers } from "../wordStamps.module";
import { IState, ITriggers } from "../../_redux/types";
import { OrderBy } from "../../__boostorm";
import { rootRep } from "../../repository";
import { WordStampErorrs } from "../wordStamps.error";
import appStore from "../../_redux/app-store";
import { _LoadGroupedWordStamps } from "../dto/_loadGroupedWordStamps";

export class LoadGroupedWordStamps {
    constructor(private opts: ScriptOptsType<IWordStampTriggers, ITriggers, IState, 'loadGroupedWordStamps'>) {}
    private requestId: string;
    private data:Array<_LoadGroupedWordStamps> = null;
    private err: string = null;

    private endError(err: string) {
        this.opts.setStatus('done', {
            'data': this.data,
            'err': err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err)
        })
        this.opts.drop()
    }

    private endSuccess(data: Array<_LoadGroupedWordStamps> ) {
        this.opts.setStatus('done', {
            'data': data,
            'err': this.err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err)
        })
        this.opts.drop()
    }


    private async loadGroupedWordStamps(user_uuid: string): Promise<Array<_LoadGroupedWordStamps>> {
        return await rootRep.select({
            'from': 'series',
            'join': {
                'chapters': {
                    'on': {
                        'left': 'serie_id',
                        'operator': '=',
                        'right': 'serie_id',
                    },
                    'join': {
                        'word_stamps': {
                            'on': {
                                'left': 'chapter_id',
                                'operator': '=',
                                'right': 'chapter_id',
                            },
                            aggregate: 'json_agg',
                            where: {
                                'user_uuid': user_uuid
                            },
                        } 
                    }
                }
            },
            'limit': 1000,
            'offset': 0,
            'select': {
                'columns': ['title', 'serie_id', 'movie_id']
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

    public async init(args: ScriptInitArgsType<IWordStampTriggers, 'loadGroupedWordStamps', 'start'>) {
        this.requestId = args.requestId;
        const authRes = await this.check(args.sessionId);
        if(!authRes.data) {
            this.endError('WRONG_SESION');
            return
        }

        try {
            this.data = await this.loadGroupedWordStamps(authRes.data.user_uuid);
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