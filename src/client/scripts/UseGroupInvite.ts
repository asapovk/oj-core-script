import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep, rootRepOpen } from "../../repository";
import { Connection, In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA, _GroupInvite } from "../../__boostorm/entities";
import {v4} from 'uuid'
import { _Users } from "../../repository/entities";

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
    async init(args: { input: {inviteToken: string,  login: string; password: string}; requestId: string; }): Promise<void> {
        this.requestId = args.requestId;

           await Connection.runTransaction(async(t) => {
            const [invite]: Array<_GroupInvite> = await rootRepOpen(t.execute).fetch({
                'table': 'group_invite',
                'where': {
                    'invite_token': args.input.inviteToken,
                    'dt_delete': null,
                },
                limit: 1,
                offset: 0
            })
            if(!invite) {
                this.err = 'INVITE_NOT_FOUND'
                return;
            }
            const user: _Users = await rootRepOpen(t.execute).insert({
                'table': 'users',
                params: {
                    'dt_delete': null,
                    'dt_last_login': null,
                    'dt_subsc_last_pay': null,
                    'info': null,
                    'phone': null,
                    'phone_confirm_code': null,
                    'ig_uid': null,
                    'tg_uid': null,
                    'email_confirm_token': null,
                    'vk_uid': null,
                    'user_uuid': v4(),
                    'password': args.input.password,
                    'username': args.input.login,
                    'email': args.input.login,
                    
                }
            })
                await rootRepOpen(t.execute).insert({
                    'table': 'group_a_user_jnt',
                    params: {
                        'id_group_invite': invite.id_group_invite,
                        'dt_expire': invite.dt_expire,
                        'id_user': user.user_id,
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
        this.end();
    }


    watch(args: WatchArgsType<ITriggers,'useGroupInvite'>): void {
            
    }

}