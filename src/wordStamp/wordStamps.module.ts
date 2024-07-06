import { Slice, Bite } from "@reflexio/core-v1";
import { TriggerPhaseWrapper } from "@reflexio/reflexio-on-redux/lib/types";
import { IState, ITriggers } from "../_redux/types";
import { _Chapters, _ScriptUpdate, _ScriptsProcessed, _Series, _WordStamps } from "../__boostorm/entities";
import { LoadGroupedWordStamps } from "./services/LoadGroupedWordStamps";
import { _LoadGroupedWordStamps } from "./dto/_loadGroupedWordStamps";
import { LoadChaptersOfStamps } from "./services/LoadChaptersOfStamps";
import { SaveWordStampService } from "./services/SaveWordStamp";
import { biteRequest } from "../service-bite/serviceBite";
import { BiteStatusWrap } from "@reflexio/core-v1/lib/types";
import { RequestTriggers } from "../service-bite/types";
import { rootRep } from "../repository";

// load init serie on app start 
// trigger in controller load serie // save result to state with requestId
// return state value in controller by requestId
// clear state


export interface CreateWordStampInput {
    writing: string;
    kana?: string;
    chapterId?: number;
    translation?: string;
    transcription?: string;
    serieId?: number;
    videoUrl?: string;
}

export interface IWordStampTriggers {
   saveWordStamp: BiteStatusWrap<RequestTriggers<{sessionId: string, input: CreateWordStampInput}, number>>;
   loadGroupedWordStamps: BiteStatusWrap<RequestTriggers<{sessionId: string},Array<_LoadGroupedWordStamps>>>;
   loadChaptersOfStamps: BiteStatusWrap<RequestTriggers< Array<number>,Array<_Chapters>>>
}



export const wordStampsSlice = Slice<IWordStampTriggers,  any, ITriggers, IState>('serie', {
    'loadGroupedWordStamps': biteRequest('loadGroupedWordStamps', LoadGroupedWordStamps, {dao: rootRep}),
    saveWordStamp: biteRequest('saveWordStamp', SaveWordStampService, {dao: rootRep}),
    'loadChaptersOfStamps': biteRequest('loadChaptersOfStamps', LoadChaptersOfStamps, {dao: rootRep}),
}, {})