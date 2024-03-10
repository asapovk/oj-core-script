import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep } from "../../repository";
import { In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA, _GroupInvite } from "../../__boostorm/entities";
import {v4} from "uuid";

export class CreateInviteService extends Script<ITriggers, IState, 'createInvite', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, 'createInvite', null>;
    private requestId: string;
    private err: string;
    private data: _GroupInvite;

    constructor(opts) {
        super()
        this.opts = opts
    }
    private end() {
        this.opts.setStatus('done', {
            'error': this.err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err),
            data: this.data,
        })
        this.opts.drop()
    }
    async init(args: { input: { sessionToken: string, groupId: number}; requestId: string; }): Promise<void> {
        this.requestId = args.requestId;
        const userRes = await appStore.hook('getUser', 'start', 'done', {
            requestId: this.requestId,
            'input': {'session_uuid': args.input.sessionToken}
        })
        if(!userRes.data) {
            this.err = AuthErrors.ACCESS_DENIED
            return
        }
        const userId = userRes.data.user_id;
        const invite =  await rootRep.insert({
            'table': 'group_invite',
            'params': {
                'id_group': args.input.groupId,
                'invite_token': v4(),
                'dt_expire': null,
            }
        })
        this.data = invite;
        this.end();
    }


    watch(args: WatchArgsType<ITriggers, 'createInvite'>): void {
            
    }

}