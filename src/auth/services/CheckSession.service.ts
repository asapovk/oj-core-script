import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { rootRep } from "../../repository";
import { _Sessions, _Users } from "../../__boostorm/entities";
import { JoinWhere } from "../../__boostorm";
import { AuthErrors } from "../auth.errors";
import { IAuthTriggers } from "../auth.module";
import { IState, ITriggers } from "../../_redux/types";
import UnsafeWhere from "../../__boostorm/operator/Where/UnsafeWhere";
import appStore from "../../_redux/app-store";

export class CheckSessionService {
   constructor(private opts: ScriptOptsType<IAuthTriggers, ITriggers, IState, 'checkSession'>) {}
   private data: {
    isAuth: boolean;
    isMaster: boolean;
   } = null;
   private err: string | null = null;
   private requestId: string = null;

   public async init(args: ScriptInitArgsType<IAuthTriggers, 'checkSession', 'start'>) {
    this.requestId = args.requestId;
    try {
        const userRes = await appStore.hook('getUser', 'start', 'done', {
            requestId: this.requestId,
            'input': {'session_uuid': args.input.sessionToken}
        })
        if(!userRes.data) {
            console.log('no user data')
            this.err = AuthErrors.ACCESS_DENIED
            return
        }
        if(userRes.data) {
            const userId = userRes.data.user_id

            const groupRes: Array<any> = await rootRep.select({
                'from':'group_a',
                where: [{
                    'id_user': UnsafeWhere({
                        'left': 'group_a_user_jnt.id_user=',
                        value: userId,
                        right: '',
                    })
                }, {id_user: userId}],
                'join': {
                    'group_a_user_jnt': {
                        on: {
                            'left': 'id_group_a',
                            'operator': '=',
                            'right': 'id_group_a',
                        },
                    },
                },
                select: {
                    columns: ['id_group_a', 'group_name', 'dt_expire', 'id_user']
                },
                limit: 1,
                offset: 0
            })
        if(groupRes.length) {
            this.data = {
                isAuth: true,
                isMaster: groupRes[0].groupAIdUser === userRes.data.user_id
            }
        }
        else {
            this.err = `${AuthErrors.SESSION_NOT_FOUND}`
        }
        }
    } catch (err) {
        err = AuthErrors.SESSION_NOT_FOUND
    } finally {
        this.opts.trigger('checkSession', 'done', {
            'ok': !Boolean(this.err),
            'err': `${this.err}`,
            'data': this.data,
            requestId: args.requestId
        })
        this.opts.drop();
    }

   }


}