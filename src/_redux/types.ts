import { ISerireTriggers } from "../serie/serie.module";
import { IAuthTriggers,  IAuthState} from "../auth/auth.module";
import { IWordStampTriggers } from "../wordStamp/wordStamps.module";
import { IClientTriggers } from "../client/client.slice";
export type IState = {
  serie: {};
  auth: IAuthState;
  wordStamp: {};
  clients: null
};

export type ITriggers = ISerireTriggers & IAuthTriggers & IWordStampTriggers & IClientTriggers;
