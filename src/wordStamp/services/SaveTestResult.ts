import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { _Series, _WordStamps } from "../../__boostorm/entities";
import { CreateWordStampInput, IWordStampTriggers } from "../wordStamps.module";
import { IState, ITriggers } from "../../_redux/types";
import { OrderBy } from "../../__boostorm";
import { rootRep } from "../../repository";
import { WordStampErorrs } from "../wordStamps.error";
import appStore from "../../_redux/app-store";
import { _LoadGroupedWordStamps } from "../dto/_loadGroupedWordStamps";
import { ServiceScript } from "../../service-bite/ServiceScript";

export class SateTEstResultScript extends ServiceScript<ITriggers, IState, 'saveQuizResult', 'init'> {
    constructor(opts: ScriptOptsType<IWordStampTriggers, ITriggers, IState, 'saveWordStamp'>) {
        super(opts)
    }
    private data: number = null;
    private err: string = null;

    // private async saveWordStamp(input: CreateWordStampInput, user_uuid: string): Promise<_WordStamps> {
    //     return await rootRep.insert({
    //         'table': 'user_quiz',
    //         'params': {
                
    //         }
    //     })
    // }

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

    public async request(args: ScriptInitArgsType<IWordStampTriggers, 'saveWordStamp', 'init'>) {
        return null
    } 
}