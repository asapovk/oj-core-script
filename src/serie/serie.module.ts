import { Slice, Bite } from "@reflexio/core-v1";
import { BiteStatusWrap } from "@reflexio/core-v1/lib/types";
import { IState, ITriggers } from "../_redux/types";
import { LoadSerieService } from "./services/LoadSerie.service";
import { _ScriptUpdate, _ScriptsProcessed, _Series } from "../__boostorm/entities";
import { UpdateScriptService } from "./services/UpdateScript.service";
import { RequestTriggers } from "../service-bite/types";
import { biteRequest } from "../service-bite/serviceBite";
import { rootRep } from "../repository";

// load init serie on app start 
// trigger in controller load serie // save result to state with requestId
// return state value in controller by requestId
// clear state

export interface ISerireTriggers {
   loadSerie: BiteStatusWrap<RequestTriggers<{ serie_id: number}, _Series & { script: JSON }>>
   updateScript: BiteStatusWrap<RequestTriggers<{sessionId: string, input: { serie_id: number, script: string}}, {}>>
}

export const serieSlice = Slice<ISerireTriggers, any, ITriggers, IState>( 'serie', {
    'loadSerie': biteRequest('loadSerie', LoadSerieService, {dao: rootRep}),
    'updateScript': biteRequest('updateScript', UpdateScriptService, {dao: rootRep}),
}, {})