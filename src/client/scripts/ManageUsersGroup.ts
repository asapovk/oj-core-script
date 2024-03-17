import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep, rootRepOpen } from "../../repository";
import { Connection, In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA, _GroupInvite } from "../../__boostorm/entities";

export class ManageUsersGrupu extends Script<ITriggers, IState, 'manageUsersGroup', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, 'manageUsersGroup', null>;
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
    
    async init(args: { input: { 
            sessionToken: string,     
            groupId: number;
            addUsersIds: Array<number>;
            deleteUsersIds: Array<number>;
        }; requestId: string; }): Promise<void> {
        this.requestId = args.requestId;
        const userRes = await appStore.hook('getUser', 'start', 'done', {
            requestId: this.requestId,
            'input': {'session_uuid': args.input.sessionToken}
        })
        console.log('INIT');
        if(!userRes.data) {
            this.err = AuthErrors.ACCESS_DENIED
            this.end();
            return
        }
        const userId = userRes.data.user_id;

        const [group]: Array<_GroupA> = await rootRep.fetch({
            'table': 'group_a',
            'where': {
                'id_user': userId,
                'id_group_a': args.input.groupId
            },
            limit: 1,
            offset: 0
        }) 
        if(!group) {
            this.err = 'GROUP_NOT_FOUND'
        }
        else  {
        await Connection.runTransaction( async (t) => {
            for(let add of args.input.addUsersIds) {
                const inserted = await rootRepOpen(t.execute).insert({
                    'table': 'group_a_user_jnt',
                    params: {
                        'dt_expire': null,
                        'id_group_invite': null,
                        'id_public_link_session': null,
                        'id_group_a': args.input.groupId,
                        'id_user':add
                    }
                })
                console.log(inserted);
            }
            if(args.input.deleteUsersIds.length) {
            await rootRepOpen(t.execute).delete({
                'table': 'group_a_user_jnt',
                where: {
                    'id_user': In(args.input.deleteUsersIds)
                }
            })
            }
        })
        }

        this.end();
    }


    watch(args: WatchArgsType<ITriggers,'manageUsersGroup'>): void {
            
    }

}