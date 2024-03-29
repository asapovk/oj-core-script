import { ISerieState, ISerireTriggers } from "../serie/serie.module";
import { IAuthTriggers,  IAuthState} from "../auth/auth.module";
import { IWordStampState, IWordStampTriggers } from "../wordStamp/wordStamps.module";
import { IClientTriggers } from "../client/client.slice";
export type IState = {
  serie: ISerieState;
  auth: IAuthState;
  wordStamp: IWordStampState;
  clients: null
};

export type ITriggers = ISerireTriggers & IAuthTriggers & IWordStampTriggers & IClientTriggers;
