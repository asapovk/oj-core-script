import { Slice, Bite } from "@reflexio/reflexio-on-redux";
import { TriggerPhaseWrapper } from "@reflexio/reflexio-on-redux/lib/types";
import { IState, ITriggers } from "../_redux/types";
import { _Chapters, _ScriptUpdate, _ScriptsProcessed, _Series, _WordStamps } from "../__boostorm/entities";
import { LoadGroupedWordStamps } from "./services/LoadGroupedWordStamps";
import { _LoadGroupedWordStamps } from "./dto/_loadGroupedWordStamps";
import { LoadChaptersOfStamps } from "./services/LoadChaptersOfStamps";

// load init serie on app start 
// trigger in controller load serie // save result to state with requestId
// return state value in controller by requestId
// clear state

export interface IWordStampTriggers {
   loadGroupedWordStamps: TriggerPhaseWrapper<{
    start: {
        requestId: string
        sessionId: string
    };
    done: {
        requestId: string
        data: Array<_LoadGroupedWordStamps>; 
        ok: boolean
        err: string
    };
   }>;
   loadChaptersOfStamps: TriggerPhaseWrapper<{
    start: {
        requestId: string
        input: Array<number>
    };
    done: {
        requestId: string
        data: Array<_Chapters>
        ok: boolean
        err: string
    };
   }>;
}

export interface IWordStampState {
    loadGroupedWordStamps: {
        lastRequest: number | null,
        requestsCount: number
    };
    loadChaptersOfStamps: {
        lastRequest: number | null,
        requestsCount: number
    }
}

export const serieInitialState: IWordStampState = {
    loadGroupedWordStamps: {
        lastRequest: null,
        requestsCount: 0,
    },
    loadChaptersOfStamps: {
        lastRequest: null,
        requestsCount: 0,
    }
}


export const loadStampsSlice = Bite<IWordStampTriggers, ITriggers, IWordStampState, IState, 'loadGroupedWordStamps'>({
    'start': null,
    done(state, payload) {
        state.loadGroupedWordStamps.lastRequest = Date.now();
    } 
}, {
    'instance': 'multiple',
    'triggerStatus': 'start',
    'updateOn': ['loadGroupedWordStamps'],
    'canTrigger': ['loadGroupedWordStamps'],
    script: LoadGroupedWordStamps,
})

export const loadChaptersOfStampsBite = Bite<IWordStampTriggers, ITriggers, IWordStampState, IState, 'loadChaptersOfStamps'>({
    'start': null,
    done(state, payload) {
        state.loadGroupedWordStamps.lastRequest = Date.now();
    } 
}, {
    'instance': 'multiple',
    'triggerStatus': 'start',
    'updateOn': ['loadChaptersOfStamps'],
    'canTrigger': ['loadChaptersOfStamps'],
    script: LoadChaptersOfStamps,
})


export const wordStampsSlice = Slice<IWordStampTriggers, ITriggers, IWordStampState, IState>('serie', {
    'loadGroupedWordStamps': loadStampsSlice,
    'loadChaptersOfStamps': loadChaptersOfStampsBite,
}, serieInitialState)