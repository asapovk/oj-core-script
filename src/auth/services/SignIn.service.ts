import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { IAuthTriggers } from "../auth.module";
import { IState, ITriggers } from "../../_redux/types";
import { rootRep } from "../../repository";
import { _PublicLink, _PublicLinkSession, _Sessions, _Users } from "../../__boostorm/entities";
import { AuthErrors } from "../auth.errors";
import { join } from "path";
import { JoinWhere, SubSelectForInsert } from "../../__boostorm";
import uuid from "uuid";
import { linkErrors } from "../link.errors";


export interface SignInReturn_ {
    usersEmail: string;
    usersUsername: string,
    sessionsSessionUuid: string,
}

export class SignInServiceService {

    //getSerieByLink
    //isPublic - param

    constructor(private opts: ScriptOptsType<IAuthTriggers, ITriggers, IState, 'signIn'>) {}
    
    private requestId: string;
    private err: string;
    private data: SignInReturn_;
   
    private end() {
        this.opts.setStatus('done', {
            'err': this.err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err),
            data: this.data,
        })
        this.opts.drop()
    }

    public async init(args: ScriptInitArgsType<IAuthTriggers, 'signIn', 'start'>) {
    this.requestId = args.requestId;
        const res: Array<SignInReturn_> = await rootRep.select({
            'from': 'users',
            select: {
                'columns': ['email', 'username',]
            },
            'join': {
                'sessions': {
                    on: {
                        'left': 'user_uuid',
                        'operator': '=',
                        'right': 'user_uuid'
                    },
                    'select': ['session_uuid']
                }
            },
            'limit': 1,
            offset: 0,
            'where': {
                'email': args.input.login,
                'password': args.input.password
            }
        })
        if(!res.length) {
            this.err = 'NOT_FOUND'
        }
        else {
            this.data = res[0];
        }
        this.end()
    }
  
}