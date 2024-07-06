import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { rootRep, rootRepOpen } from "../../repository";
import { IState, ITriggers } from "../../_redux/types";
import { ISerireTriggers } from "../serie.module";
import { _ScriptsProcessed, _Series } from "../../__boostorm/entities";
import appStore from "../../_redux/app-store";
import { SerieErorrs } from "../serie.error";
import { ServiceScript } from "../../service-bite/ServiceScript";

export class UpdateScriptService extends ServiceScript<ITriggers, IState, 'updateScript', 'init'> {

    constructor(opts: ScriptOptsType<ISerireTriggers, ITriggers, IState, 'updateScript'>) {
        super(opts)
    }
    private err: string = null;

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

    private async getScript(serieId: number) {
        return await rootRep.fetch({
            'table': 'scripts_processed',
                'limit': 1,
                'offset': 0,
                'where': {
                    'serie_id': serieId
                }
        })
    }
    public async request(args: ScriptInitArgsType<ITriggers, 'updateScript', 'init'>) {
        this.requestId = args.requestId;
        const authRes = await this.check(args.requestId);
        if(!authRes.data) {
            return
        }
        let err: string = null;
        let ok: boolean = false;
        try {
            const scripts: Array<_ScriptsProcessed> = await this.getScript(args.data.input.serie_id)
            if(scripts.length) {
            const script_Id: number = scripts[0].script_id;
            let body  = null;
            try {
                body = JSON.parse(args.data.input.script);
            } catch (error) {
                throw new Error(SerieErorrs.SERIE_SCRIPT_NOT_PROVIDED) 
            }
            if(body) {
                const res =  await this.createScriptUpdate(authRes.data.user_id,script_Id, body)
                if(res) {
                    return res
                 }
                 throw new Error(SerieErorrs.SERIE_NOT_FOUND) 
            }
            throw new Error (SerieErorrs.SERIE_SCRIPT_NOT_PROVIDED) 
        }
        else {
            throw new Error(SerieErorrs.SERIE_SYSTEM_ERR) 
        }
        } catch (err) {
            throw new Error(SerieErorrs.SERIE_SYSTEM_ERR) 
        }
    }   

}