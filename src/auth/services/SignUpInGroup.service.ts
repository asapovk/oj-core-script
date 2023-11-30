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

    ///accept link + public_session + 
    /// if link_is not public
    public async init(args: ScriptInitArgsType<IAuthTriggers, 'signIn', 'start'>) {
    this.requestId = args.requestId;
        const res: _Users = await rootRep.insert({
            'table': 'users',
            'params': {
                'user_uuid': uuid(),
                'password': args.input.password,
                'email': args.input.login,
                'username': args.input.login,
                'phone': null,
                'email_confirm_token': null,
                'ig_uid': null,
                'phone_confirm_code': null,
                'tg_uid': null,
                'dt_subsc_last_pay': null,
                'dt_last_login': 'now()' as unknown as Date,
                'dt_delete': null,
                'info': null,
                'vk_uid': null,
            }
        })
        if(!res) {
            this.err = 'ALREADY_EXIST'
        }
        else {
            this.data = res[0];
        }
        this.end()
    }
  
}