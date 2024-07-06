import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { _Chapters, _Series, _WordStamps } from "../../__boostorm/entities";
import { IWordStampTriggers } from "../wordStamps.module";
import { IState, ITriggers } from "../../_redux/types";
import { OrderBy, In } from "../../__boostorm";
import { rootRep } from "../../repository";
import { WordStampErorrs } from "../wordStamps.error";
import appStore from "../../_redux/app-store";
import { _LoadGroupedWordStamps } from "../dto/_loadGroupedWordStamps";

export class LoadChaptersOfStamps {
    constructor(private opts: ScriptOptsType<IWordStampTriggers, ITriggers, IState, 'loadChaptersOfStamps'>) {}
    private requestId: string;
    private data: Array<_Chapters> = null;
    private err: string = null;

    private end(err: string | null) {
        this.opts.setStatus('done', {
            'data': this.data,
            'err': err || null,
            'requestId': this.requestId,
            'ok': !Boolean(this.err)
        })
        this.opts.drop()
    }


    private async loadChapters(ids: Array<number>): Promise<Array<_Chapters>> {
        return await rootRep.fetch({
            'table': 'chapters',
            'where': {
                'chapter_id': In(ids),
            },
            'limit': 1000,
            offset: 0
        })
    }

    public async init(args: ScriptInitArgsType<IWordStampTriggers, 'loadChaptersOfStamps', 'init'>) {
        this.requestId = args.requestId;
        try {
            this.data = await this.loadChapters(args.data);
        } catch (err) {
            this.end(WordStampErorrs.WORD_STAMP_SYSTEM_ERR) 
            return
        } finally {
           this.end(this.err);
        }
    } 
}