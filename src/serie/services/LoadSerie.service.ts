import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { rootRep, rootRepOpen } from "../../repository";
import { IState, ITriggers } from "../../_redux/types";
import { ISerireTriggers } from "../serie.module";
import { join } from "path";
import { _ScriptUpdate, _ScriptsProcessed, _Series } from "../../__boostorm/entities";
import { SerieErorrs } from "../serie.error";
import { OrderBy } from "../../__boostorm";
import { ServiceScript } from "../../service-bite/ServiceScript";


export class LoadSerieService extends ServiceScript<ITriggers, IState, 'loadSerie', 'init'> {

    constructor(opts: ScriptOptsType<ISerireTriggers, ITriggers, IState, 'loadSerie'>) {
        super(opts)
    }
    private data: _Series & { script: JSON } = null;
    private err: string = null;


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

    public async request(args: ScriptInitArgsType<ISerireTriggers, 'loadSerie', 'init'>) {
        this.requestId = args.requestId;
        let script: JSON = null;

        try {
            const seriesWithScript = await this.loadSerieWithScript(args.data.serie_id);
            if(!seriesWithScript.length) {
                throw new Error(SerieErorrs.SERIE_NOT_FOUND) 
                
            }
            if(!seriesWithScript[0].scripts.length) {
                throw new Error(SerieErorrs.SERIE_SCRIPT_NOT_FOUND) 
            }
            const scriptId = seriesWithScript[0].scripts[0].script_id;
            const scriptUpds = await this.loadScriptUpdate(scriptId);
            if(!scriptUpds.length) {
                script = seriesWithScript[0].scripts[0].body
                return {
                    ...seriesWithScript[0],
                    'script': script,
                }
            }
            return  {
                ...seriesWithScript[0],
                'script': scriptUpds[0].script_body,
            }
            
        } catch (err) {
            throw new Error(SerieErorrs.SERIE_SYSTEM_ERR)
            
        } finally {
            console.log('FINALLY');
        
            if(this.err) {
                throw new Error(this.err)
            }
            //return this.data
        }
    }   
}