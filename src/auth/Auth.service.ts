import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { IAuthTriggers } from "./auth.module";
import { IState, ITriggers } from "../_redux/types";
import { rootRep } from "../repository";
import { _Sessions, _Users } from "../__boostorm/entities";
import { AuthErrors } from "./auth.errors";
import { join } from "path";
import { JoinWhere } from "../__boostorm";

export class AuthService {
   constructor(private opts: ScriptOptsType<IAuthTriggers, ITriggers, IState, 'getUser'>) {}

   public async init(args: ScriptInitArgsType<IAuthTriggers, 'getUser', 'start'>) {
    let data: _Users | null = null;
    let err: string | null = null;
    try {
        const res: Array<_Users & {sessions: Array<_Sessions>} > = await rootRep.fetch({
            'table': 'users',
            'limit': 1,
            'offset': 0,
            join: {
                select: 'sessions',
                'table': 'sessions',
                'where': (c) => JoinWhere(c.sessions, {
                    session_uuid: args.input.session_uuid
                })
            },
        })
        if(res.length) {
            data = res[0]
        }
        else {
            err = `${AuthErrors.SESSION_NOT_FOUND}`
        }
    } catch (err) {
        err = AuthErrors.SESSION_NOT_FOUND
    } finally {
        this.opts.trigger('getUser', 'done', {
            'ok': !Boolean(err),
            'err': `${err}`,
            'data': data,
            requestId: args.requestId
        })
        this.opts.drop();
    }

   }


}