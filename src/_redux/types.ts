import { ISerieState, ISerireTriggers } from "../serie/serie.module";
import { IAuthTriggers,  IAuthState} from "../auth/auth.module";
import { IWordStampState, IWordStampTriggers } from "../wordStamp/wordStamps.module";
export type IState = {
  serie: ISerieState;
  auth: IAuthState;
  wordStamp: IWordStampState;
};

export type ITriggers = ISerireTriggers & IAuthTriggers & IWordStampTriggers;
