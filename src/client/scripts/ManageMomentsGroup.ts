import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { rootRep, rootRepOpen } from "../../repository";
import { Connection, In } from "../../__boostorm";
import appStore from "../../_redux/app-store";
import { AuthErrors } from "../../auth/auth.errors";
import { _GroupA, _GroupInvite } from "../../__boostorm/entities";

export class ManageMomentsGrupu extends Script<ITriggers, IState, 'manageMomentsGroup', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, 'manageMomentsGroup', null>;
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
            addLinksIds: Array<number>;
            deleteLinksIds: Array<number>;
        }; requestId: string; }): Promise<void> {
        this.requestId = args.requestId;
        const userRes = await appStore.hook('getUser', 'start', 'done', {
            requestId: this.requestId,
            'input': {'session_uuid': args.input.sessionToken}
        })
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
            for(let add of args.input.addLinksIds) {
                await rootRepOpen(t.execute).insert({
                    'table': 'group_a_public_link_jnt',
                    params: {
                        'id_group': args.input.groupId,
                        'id_public_link':add
                    }
                })
            }
            await rootRepOpen(t.execute).delete({
                'table': 'group_a_public_link_jnt',
                where: {
                    'id_public_link': In(args.input.deleteLinksIds)
                }
            })
        })
        }

        this.end();
    }


    watch(args: WatchArgsType<ITriggers,'manageMomentsGroup'>): void {
            
    }

}