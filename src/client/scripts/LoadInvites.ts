import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep } from "../../repository";
import { In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA, _GroupInvite } from "../../__boostorm/entities";


export class LoadInvites extends Script<ITriggers, IState, 'loadInvites', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, 'loadInvites', null>;
    private requestId: string;
    private err: string;
    private data: Array<_GroupInvite> = [];

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


    async init(args: { input: { sessionToken: string;  groupId?: number; }; requestId: string; }): Promise<void> {
        this.requestId = args.requestId;
        const userRes = await appStore.hook('getUser', 'start', 'done', {
            requestId: this.requestId,
            'input': {'session_uuid': args.input.sessionToken}
        })
        if(!userRes.data) {
            this.err = AuthErrors.ACCESS_DENIED
            this.end()
            return
        }
        const userId = userRes.data.user_id;
        const groupsOwn: Array<_GroupA> = await rootRep.fetch({
            'table': 'group_a',
            where: {
                'id_user': userId,
            },
            limit: 'infinity',
            offset: 0
        })

        if(groupsOwn.length) {
            const invites: Array<_GroupInvite> = await rootRep.fetch({
                'table': 'group_invite',
                where: {
                    'id_group': In(groupsOwn.map( g => g.id_group_a))
                },
                limit: 'infinity',
                offset: 0
            })
            this.data = invites;
        }

        this.end();
    }


    watch(args: WatchArgsType<ITriggers, 'loadInvites'>): void {
            
    }

}