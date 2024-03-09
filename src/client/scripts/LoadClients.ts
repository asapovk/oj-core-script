import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep } from "../../repository";
import { In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA } from "../../__boostorm/entities";

export interface __SelectUsersOfGroupsReturn {
    groupAUserJntIdGroupAUserJnt: number,
    usersEmail: string,
    usersUserId: number,
    usersUsername: string,
    usersUserUuid: string,
    usersPhone: string,
    usersPassword: string,
    groupAGroupName: string,
    groupADtCreate: Date,
    groupADtExpire: Date | null,
    groupAIdGroupA: number
}


export class LoadClients extends Script<ITriggers, IState, 'loadClients', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, 'loadClients', null>;
    private requestId: string;
    private err: string;
    private data: Array<__SelectUsersOfGroupsReturn>;

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

    private async selectUsersOfGroups(groupsIds: Array<number>, filter?: {groupId: number}) {
        let ids = [];
        if(!groupsIds) {
            return []
        }
        ids = groupsIds;
        if(filter?.groupId) {
            if(groupsIds.indexOf(filter.groupId) === -1) {
                return []
            }
        }
        const resp = await rootRep.select({
            'from': 'group_a_user_jnt',
            join: {
                'users': {
                    'on': {
                        'left': 'id_user',
                        'operator': '=',
                        'right': 'user_id'
                    },
                    select: ['email', 'user_id', 'username', 'user_uuid', 'phone', 'password']
                },
                'group_a': {
                    'on': {
                        'left': 'id_group_a',
                        'operator': '=',
                        'right': 'id_group_a'
                    },
                    select: ['group_name', 'dt_create', 'dt_expire', 'id_group_a']
                },
            },
            where: {
                'id_group_a': filter.groupId || In(ids),
            },
            select: {
                'columns': ['id_group_a_user_jnt']
            },
            limit: 'infinity',
            offset: 0
        }) 
        return resp;
    }

    async init(args: { input: { sessionToken: string;  groupId?: number; }; requestId: string; }): Promise<void> {
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
        const groupsOwn: Array<Pick<_GroupA, 'id_group_a'>> = await rootRep.fetch({
            'table': 'group_a',
            select: ['id_group_a'],
            where: {
                'id_user': userId,
            },
            limit: 'infinity',
            offset: 0
        })

        this.data = await this.selectUsersOfGroups(groupsOwn.map(g => g.id_group_a), {
            'groupId': args.input.groupId
        });
        this.end();
    }


    watch(args: WatchArgsType<ITriggers, "loadClients">): void {
            
    }

}