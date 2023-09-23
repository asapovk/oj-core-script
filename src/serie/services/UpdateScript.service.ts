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

    private async check(sessionId: string) {
        const res = await appStore.hook('getUser', 'start', 'done', {
            'input': {
                'session_uuid': sessionId,
            },
            requestId: this.requestId,
        })
        if(!res.ok) {
            // console.log("NOT OK")
            // this.opts.setStatus('done', {
            //     'ok': false,
            //     requestId: this.requestId,
            //     'err': res.err,
            // })
        }
        //this.opts.drop();

        return res;
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
                console.log('good');
            } catch (error) {
                console.log('not good');
                err = 'INVALID_JSON_BODY'
            }
            if(body) {
                const res = await rootRep.insert({
                    'table': 'script_update',
                    params: {
                        'id_script_processed': script_Id,
                        'id_user': authRes.data.user_id,
                        'script_body': body
                    }
                })
                if(res) {
                    ok = true;
                 }
                 else {
                     err = `${SerieErorrs.SERIE_NOT_FOUND}`
                 }
            }
        }
        else {
            err = `${SerieErorrs.SERIE_SYSTEM_ERR}`
        }
        } catch (err) {
            err = `${SerieErorrs.SERIE_SYSTEM_ERR}`
        }
        finally {
            console.log("SET DONE!")
            this.opts.setStatus('done', {
                requestId: args.requestId,
                'err': err,
                'ok': ok
            })
            this.opts.drop();
        }
    }   

    public update(args) {
    
    }
}