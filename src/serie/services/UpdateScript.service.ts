import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { rootRep, rootRepOpen } from "../../repository";
import { IState, ITriggers } from "../../_redux/types";
import { ISerireTriggers } from "../serie.module";
import { _ScriptsProcessed, _Series } from "../../__boostorm/entities";
import appStore from "../../_redux/app-store";
import { SerieErorrs } from "../serie.error";

export class UpdateScriptService {

    constructor(private opts: ScriptOptsType<ISerireTriggers, ITriggers, IState, 'updateScript'>) {}
    private requestId: string;
    private err: string = null;

    private endError(err: string) {
        this.opts.setStatus('done', {

            'err': err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err)
        })
        this.opts.drop()
    }

    private endSuccess() {
        this.opts.setStatus('done', {
            'err': this.err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err)
        })
        this.opts.drop()
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
            })
            this.opts.drop();
        }

        return res;
    }
    private async createScriptUpdate(userId: number, scriptId: number, body: JSON) {
        return await rootRep.insert({
            'table': 'script_update',
            params: {
                'id_script_processed': scriptId,
                'id_user': userId,
                'script_body': body
            }
        })
    }

    public async init(args: ScriptInitArgsType<ITriggers, 'updateScript', 'start'>) {
        this.requestId = args.requestId;
        const authRes = await this.check(args.sessionId);
        if(!authRes.data) {
            return
        }
        let err: string = null;
        let ok: boolean = false;
        try {
            const scripts: Array<_ScriptsProcessed> = await rootRep.fetch({
                'table': 'scripts_processed',
                'limit': 1,
                'offset': 0,
                'where': {
                    'serie_id': args.input.serie_id
                }
            });
            if(scripts.length) {
            const script_Id: number = scripts[0].script_id;
            let body  = null;
            try {
                body = JSON.parse(args.input.script);
            } catch (error) {
                this.endError(SerieErorrs.SERIE_SCRIPT_NOT_PROVIDED) 
                return
            }
            if(body) {
                const res =  await this.createScriptUpdate(authRes.data.user_id,script_Id, body)
                if(res) {
                    this.endSuccess()
                    return
                 }
                 this.endError(SerieErorrs.SERIE_NOT_FOUND) 
                 return
            }
            this.endError(SerieErorrs.SERIE_SCRIPT_NOT_PROVIDED) 
            return
        }
        else {
            this.endError(SerieErorrs.SERIE_SYSTEM_ERR) 
            return
        }
        } catch (err) {
            this.endError(SerieErorrs.SERIE_SYSTEM_ERR) 
            return
        }
    }   

}