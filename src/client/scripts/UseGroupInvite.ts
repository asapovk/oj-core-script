import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep, rootRepOpen } from "../../repository";
import { Connection, In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA, _GroupInvite } from "../../__boostorm/entities";

export class UseGroupInviteService extends Script<ITriggers, IState, 'useGroupInvite', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, 'useGroupInvite', null>;
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
            data: this.data,
        })
        this.opts.drop()
    }
    async init(args: { input: { sessionToken: string, inviteToken: string}; requestId: string; }): Promise<void> {
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
        const [invite]: Array<_GroupInvite> = await rootRep.fetch({
            'table': 'group_invite',
            where: {
                'invite_token': args.input.inviteToken,
            },
            limit: 1,
            offset: 0
        })
        if(!invite) {
            this.err = 'INVITATION_NOT_FOUND'
        }
        else {
           await Connection.runTransaction(async(t) => {
                await rootRepOpen(t.execute).insert({
                    'table': 'group_a_user_jnt',
                    params: {
                        'id_group_invite': invite.id_group_invite,
                        'dt_expire': invite.dt_expire,
                        'id_user': userId,
                        'id_group_a': invite.id_group,
                        'id_public_link_session': null,
                    }
                })
                await rootRepOpen(t.execute).update({
                    'table': 'group_invite',
                    params: {
                        'use_cnt': invite.use_cnt + 1,
                    },
                    where: {
                        id_group_invite: invite.id_group_invite
                    }
                })
            })
        }
        this.end();
    }


    watch(args: WatchArgsType<ITriggers,'useGroupInvite'>): void {
            
    }

}