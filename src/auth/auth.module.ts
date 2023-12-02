import { Slice, Bite } from "@reflexio/reflexio-on-redux";
import { TriggerPhaseWrapper } from "@reflexio/reflexio-on-redux/lib/types";
import { IState, ITriggers } from "../_redux/types";
//import { LoadSerieService } from "./services/LoadSerie.service";
import { _PublicLink, _PublicLinkSession, _Series, _Sessions, _Users } from "../__boostorm/entities";
import { AuthService } from "./Auth.service";
import { CreatePublicLinkService } from "./services/CreatePublicLink.service";
import { SignInReturn_, SignInServiceService } from "./services/SignIn.service";
import { GetLinkDataService, AuthenticateReturn_ } from "./services/GetLinkData.service";

// load init serie on app start 
// trigger in controller load serie // save result to state with requestId
// return state value in controller by requestId
// clear state

export interface IAuthTriggers {
    signIn: TriggerPhaseWrapper<{
        start: {
            requestId: string
            input: { login: string; password: string}
        };
        done: {
            ok: boolean,
            requestId: string
            data: SignInReturn_
            err: string
        };
   }>;
    getUser: TriggerPhaseWrapper<{
        start: {
            requestId: string
            input: { session_uuid: string}
        };
        done: {
            ok: boolean,
            requestId: string
            data: _Users
            err: string
        };
   }>;
   createPublicLink: TriggerPhaseWrapper<{
    start: {
        requestId: string
        input: {start?: string, end?: string, serieId: number, link_value: string, groupId?: number}
    };
    done: {
        ok: boolean,
        requestId: string
        data: _PublicLink
        err: string
    };
   }>
   authenticateLink: TriggerPhaseWrapper<{
    start: {
        requestId: string
        input: {link_value: string, sessionValue?: string}
    };
    done: {
        ok: boolean,
        requestId: string
        data: AuthenticateReturn_
        err: string
    };
   }>
//    getSession: TriggerPhaseWrapper<{
//     start: {
//         requestId: string
//         input: { session_uuid: string}
//     };
//     done: {
//         ok: boolean,
//         requestId: string
//         data: _Users
//         err: string
//     }}>
}

export interface IAuthState {
    getUser: {
        lastRequest: number | null,
        requestsCount: number
    }; 
}

export const authInitialState: IAuthState =  {
    'getUser': {
        'lastRequest': null,
        'requestsCount': 0
    }
}


export const authenticateLinkBite = Bite<IAuthTriggers, ITriggers, IAuthState, IState, 'authenticateLink'>({
     'start': null,
     done(state, payload) {
        state.getUser.lastRequest = Date.now();
     }
}, {
    'instance': 'multiple',
    'triggerStatus': 'start',
    'updateOn': ['authenticateLink'],
    'canTrigger': ['authenticateLink'],
    script: GetLinkDataService,
})



export const getUserBite = Bite<IAuthTriggers, ITriggers, IAuthState, IState, 'getUser'>({
    'start': null,
    done(state, payload) {
       state.getUser.lastRequest = Date.now();
    }
}, {
   'instance': 'multiple',
   'triggerStatus': 'start',
   'updateOn': ['getUser'],
   'canTrigger': ['getUser'],
   script: AuthService,
})


export const signInkBite = Bite<IAuthTriggers, ITriggers, IAuthState, IState, 'signIn'>({
    'start': null,
    done(state, payload) {
       state.getUser.lastRequest = Date.now();
    }
}, {
   'instance': 'multiple',
   'triggerStatus': 'start',
   'updateOn': ['signIn'],
   'canTrigger': ['signIn'],
   script: SignInServiceService,
})

export const createPublicLinkBite = Bite<IAuthTriggers, ITriggers, IAuthState, IState, 'createPublicLink'>({
    'start': null,
    done(state, payload) {
       state.getUser.lastRequest = Date.now();
    }
}, {
   'instance': 'multiple',
   'triggerStatus': 'start',
   'updateOn': ['createPublicLink'],
   'canTrigger': ['createPublicLink'],
   script: CreatePublicLinkService,
})




export const authSlice = Slice<IAuthTriggers, ITriggers, IAuthState, IState>('getUser', {
    'getUser': getUserBite,
    signIn: signInkBite,
    createPublicLink: createPublicLinkBite,
    authenticateLink: authenticateLinkBite,
}, authInitialState)

// flow
// authenticate with link and session => check is link public and vaild 
// if not public => ask to provide login and password 
// if public => create and return session (not usuasl session but session link) and continue
