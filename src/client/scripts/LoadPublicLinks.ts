import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep } from "../../repository";
import { In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA } from "../../__boostorm/entities";

export interface __SelectLinksOfGroupsReturn {
    groupAPublicLinkJntDtCreate: Date,
    publicLinkDtExprire: string | null,
    publicLinkStartSecond: string,
    publicLinkEndSecond: string,
    publicLinkIsAuthRequired: false,
    publicLinkIdSerie: number,
    publicLinkIdPublicLink: number,
    publicLinkLinkValue: string,
    groupAGroupName: string,
    groupADtCreate: Date,
    groupADtExpire: Date | null,
    groupAIdGroupA: number
}


export class LoadPublicLinks extends Script<ITriggers, IState, 'loadPublicLinks', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, 'loadPublicLinks', null>;
    private requestId: string;
    private err: string;
    private data: Array<__SelectLinksOfGroupsReturn>;

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

    private async selectLinksOfGroups(groupsIds: Array<number>, filter?: {groupId: number}) {
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
            'from': 'group_a_public_link_jnt',
            join: {
                'public_link': {
                    'on': {
                        'left': 'id_public_link',
                        'operator': '=',
                        'right': 'id_public_link'
                    },
                    select: ['dt_exprire', 'start_second', 'end_second', 'is_auth_required', 'id_serie', 'id_public_link', 'link_value']
                },
                'group_a': {
                    'on': {
                        'left': 'id_group',
                        'operator': '=',
                        'right': 'id_group_a'
                    },
                    select: ['group_name', 'dt_create', 'dt_expire', 'id_group_a']
                },
            },
            where: {
                'id_group': filter.groupId || In(ids),
            },
            select: {
                'columns': ['dt_create']
            },
            limit: 'infinity',
            offset: 0
        }) 
        console.log(resp);
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

        this.data = await this.selectLinksOfGroups(groupsOwn.map(g => g.id_group_a), {
            'groupId': args.input.groupId
        });
        this.end();
    }


    watch(args: WatchArgsType<ITriggers, "loadPublicLinks">): void {
            
    }

}