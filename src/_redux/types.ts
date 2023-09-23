import { ISerieState, ISerireTriggers } from "../serie/serie.module";
import { IAuthTriggers,  IAuthState} from "../auth/auth.module";
export type IState = {
  serie: ISerieState;
  auth: IAuthState;
};

export type ITriggers = ISerireTriggers & IAuthTriggers;
