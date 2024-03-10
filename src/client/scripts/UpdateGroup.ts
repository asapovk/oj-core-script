import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep } from "../../repository";
import { In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA } from "../../__boostorm/entities";

export class UpdateGroupService extends Script<ITriggers, IState, 'updateGroup', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, 'updateGroup', null>;
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
        const [group]: Array<_GroupA> =  await rootRep.fetch({
            'table': 'group_a',
            where: {
                'id_user':userId,
                'id_group_a': args.input.groupId
            },
            limit: 1,
            offset: 0
        })
        if(!group) {
            this.err = 'GROUP_NOT_FOUND'
        }
        this.end();
    }


    watch(args: WatchArgsType<ITriggers,'updateGroup'>): void {
            
    }

}