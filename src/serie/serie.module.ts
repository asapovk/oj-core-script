import { Slice, Bite } from "@reflexio/reflexio-on-redux";
import { TriggerPhaseWrapper } from "@reflexio/reflexio-on-redux/lib/types";
import { ITriggers } from "../_redux/types";
import { LoadSerieService } from "./services/LoadSerie.service";
import { _ScriptUpdate, _ScriptsProcessed, _Series } from "../__boostorm/entities";
import { UpdateScriptService } from "./services/UpdateScript.service";

// load init serie on app start 
// trigger in controller load serie // save result to state with requestId
// return state value in controller by requestId
// clear state

export interface ISerireTriggers {
   loadSerie: TriggerPhaseWrapper<{
    start: {
        requestId: string
        input: { serie_id: number}
    };
    done: {
        requestId: string
        data: _Series & { script: JSON }
        ok: boolean
        err: string
    };
   }>;
   updateScript: TriggerPhaseWrapper<{
    start: {
        requestId: string
        sessionId: string
        input: { serie_id: number, script: string}
    };
    done: {
        requestId: string
        err: string
        ok: boolean
    };
   }>
}

export interface ISerieState {
    loadSerie: {
        lastRequest: number | null,
        requestsCount: number
    };
    updateScript: {
        lastRequest: number | null,
        requestsCount: number
    }; 
}

export const serieInitialState: ISerieState = {
    loadSerie: {
        lastRequest: null,
        requestsCount: 0,
    },
    updateScript: {
        lastRequest: null,
        requestsCount: 0,
    },
}


export const loadSerieSlice = Bite<ISerireTriggers, ITriggers, ISerieState, ISerieState, 'loadSerie'>({
    'start': null,
    done(state, payload) {
        state.loadSerie.lastRequest = Date.now();
    } 
}, {
    'instance': 'multiple',
    'triggerStatus': 'start',
    'updateOn': ['loadSerie'],
    'canTrigger': ['loadSerie'],
    script: LoadSerieService,
})

export const updateSerieSlice = Bite<ISerireTriggers, ITriggers, ISerieState, ISerieState, 'updateScript'>({
    'start': null,
    done(state, payload) {
        state.updateScript.lastRequest = Date.now();
    } 
}, {
    'instance': 'multiple',
    'triggerStatus': 'start',
    'updateOn': ['updateScript'],
    'canTrigger': ['updateScript'],
    script: UpdateScriptService,
})

export const serieSlice = Slice<ISerireTriggers, ITriggers, ISerieState, ISerieState>('serie', {
    'loadSerie': loadSerieSlice,
    'updateScript': updateSerieSlice,
}, serieInitialState)