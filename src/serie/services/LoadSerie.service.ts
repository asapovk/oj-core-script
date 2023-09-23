import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { rootRep, rootRepOpen } from "../../repository";
import { IState, ITriggers } from "../../_redux/types";
import { ISerireTriggers } from "../serie.module";
import { join } from "path";
import { _ScriptUpdate, _ScriptsProcessed, _Series } from "../../__boostorm/entities";
import { SerieErorrs } from "../serie.error";
import { OrderBy } from "../../__boostorm";


export class LoadSerieService {

    constructor(private opts: ScriptOptsType<ISerireTriggers, ITriggers, IState, 'loadSerie'>) {}
    private requestId: string;
    private data: _Series & { script: JSON } = null;
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

    private endSuccess(data: _Series & { script: JSON }) {
        this.opts.setStatus('done', {
            'data': data,
            'err': this.err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err)
        })
        this.opts.drop()
    }


    private async loadScriptUpdate(scriptId: number): Promise<Array<_ScriptUpdate>> {
        return await rootRep.fetch({
            'table': 'script_update',
            where: {
                'id_script_processed': scriptId
            },
            limit: 1,
            offset: 0,
            orderBy: (c) => OrderBy(c, 'id_script_update', 'desc') 
        })
    }

    private async loadSerieWithScript(serieId: number): Promise<Array<_Series & {scripts: Array<_ScriptsProcessed>}>> {
        return await rootRep.fetch({
            'table': 'series',
            'limit': 1,
            'offset': 0, 
            'where': {
                'serie_id': serieId,
            },
            join: {
                'table': 'scripts_processed',
                select: 'scripts',
            }
        })
    }

    public async init(args: ScriptInitArgsType<ISerireTriggers, 'loadSerie', 'start'>) {
        this.requestId = args.requestId;
        let script: JSON = null;

        try {
            const seriesWithScript = await this.loadSerieWithScript(args.input.serie_id);
            if(!seriesWithScript.length) {
                this.endError(SerieErorrs.SERIE_NOT_FOUND) 
                return
            }
            if(!seriesWithScript[0].scripts.length) {
                this.endError(SerieErorrs.SERIE_SCRIPT_NOT_FOUND) 
                return 
            }
            const scriptId = seriesWithScript[0].scripts[0].script_id;
            const scriptUpds = await this.loadScriptUpdate(scriptId);
            if(!scriptUpds.length) {
                script = seriesWithScript[0].scripts[0].body
                this.endSuccess({
                    ...seriesWithScript[0],
                    'script': script,
                })
                return 
            }
            this.endSuccess({
                ...seriesWithScript[0],
                'script': scriptUpds[0].script_body,
            })
            
        } catch (err) {
            this.endError(SerieErorrs.SERIE_SYSTEM_ERR) 
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