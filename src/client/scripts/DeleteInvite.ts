import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep } from "../../repository";
import { In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA } from "../../__boostorm/entities";

export class DeleteInviteService extends Script<ITriggers, IState, 'deleteInvite', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, 'deleteInvite', null>;
    private requestId: string;
    private err: string;
    private data: boolean;

    constructor(opts) {
        super()
        this.opts = opts
    }
    private end() {
        this.opts.setStatus('done', {
            'error': this.err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err),
            data: true, //this.data,
        })
        this.opts.drop()
    }
    async init(args: { input: { sessionToken: string, inviteId: number}; requestId: string; }): Promise<void> {
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
        await rootRep.delete({
            'table': 'group_invite',
            'where': {
                'id_group_invite': args.input.inviteId
            }
        })
        this.end();
    }


    watch(args: WatchArgsType<ITriggers, 'deleteInvite'>): void {
            
    }

}