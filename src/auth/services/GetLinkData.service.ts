import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { IAuthTriggers } from "../auth.module";
import { IState, ITriggers } from "../../_redux/types";
import { rootRep, rootRepOpen } from "../../repository";
import { _PublicLink, _PublicLinkSession, _Sessions, _Users } from "../../__boostorm/entities";
import { AuthErrors } from "../auth.errors";
import { join } from "path";
import { Connection, JoinWhere, SubSelectForInsert } from "../../__boostorm";
import uuid from "uuid";
import { linkErrors } from "../link.errors";


export interface AuthenticateReturn_ {
    publicLinkDtExprire: Date | null,
    publicLinkStartSecond: string | null,
    publicLinkEndSecond: string | null,
    publicLinkIdSerie: number,
    publicLinkSessionSessionValue: string
    session_value?: string
}

export class GetLinkDataService {

    //getSerieByLink
    //isPublic - param

    constructor(private opts: ScriptOptsType<IAuthTriggers, ITriggers, IState, 'authenticateLink'>) {}
    
    private requestId: string;
    private err: string;
    private data: AuthenticateReturn_;
    private sessionValue: string;

    private end() {
        this.opts.setStatus('done', {
            'err': this.err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err),
            data: this.data,
        })
        this.opts.drop()
    }
   

    public async init(args: ScriptInitArgsType<IAuthTriggers, 'authenticateLink', 'start'>) {
    this.requestId = args.requestId;
    this.data = {} as any;
    const linkRes: Array<_PublicLink> = await rootRep.fetch({
        'table': 'public_link',
        'where': {
            'link_value': args.input.link_value,
        },
        limit: 1,
        offset: 0
    })
    if(!linkRes) {
        this.err = 'NOT_FOUND';
        this.end();
    }else {
        this.data =  {
            'publicLinkDtExprire': linkRes[0].dt_exprire,
            'publicLinkStartSecond': linkRes[0].start_second,
            'publicLinkEndSecond': linkRes[0].end_second,
            'publicLinkIdSerie': linkRes[0].id_serie,
            'publicLinkSessionSessionValue': null,
        }
    }

    if(linkRes[0].is_auth_required) {
        if(args.input.sessionValue) {
             await this.processsPrivateLink(args.input.sessionValue, linkRes[0].id_public_link)
        } else {
            this.err = AuthErrors.ACCESS_DENIED
        }

    } else {
        await this.processsPublicLink(linkRes[0].id_public_link, args.input.sessionValue)
    }
    if(this.err) {
        this.data = null;
    }
    this.end();
      
      //  get Link 
      //  if public => get session and usage => if not => create session and create usage,
      //  if session without usaga => create usage

      // NOT public 
      // get user
      // select group joint user_jnt joint link_jnt with user_id and link_id
    }

    private async processsPrivateLink(sessionValue: string, linkId: number) {
        const userRes = await this.opts.hook('getUser', 'start', 'done', {
            requestId: this.requestId,
            'input': {'session_uuid': sessionValue}
        })
        if(!userRes.data) {
            this.err = AuthErrors.ACCESS_DENIED
            return
        }
        if(userRes.data) {
            const userId = userRes.data.user_id

            const groupRes: Array<any> = await rootRep.select({
                'from':'group_a',
                'join': {
                    'group_a_user_jnt': {
                        on: {
                            'left': 'id_group_a',
                            'operator': '=',
                            'right': 'id_group_a',
                        },
                        where: {
                            'id_user': userId,
                        }
                    },
                    'group_a_public_link_jnt': {
                        on: {
                            'left': 'id_group_a',
                            'operator': '=',
                            'right': 'id_group',
                        },
                        where: {
                            'id_public_link': linkId,
                        }
                    }
                },
                select: {
                    columns: ['id_group_a', 'group_name', 'dt_expire']
                },
                limit: 1,
                offset: 0
            })

            if(!groupRes.length) {
                this.err = AuthErrors.ACCESS_DENIED
            }
            
        }
    }

    private async processsPublicLink(linkId: number, sessionValue?: string) {
        //if session
        //check session
        //create session
        //create link usage

        let confirmedSession: _PublicLinkSession = null;
        if(sessionValue) {
            const publicLinkSessionRes: Array<_PublicLinkSession> = await rootRep.fetch({
                'table': 'public_link_session',
                'where': {
                    'session_value': sessionValue
                },
                limit: 1, 
                offset: 0
            })
            if(publicLinkSessionRes.length) {
                confirmedSession = publicLinkSessionRes[0];
            }
            
        }
        const ses: _PublicLinkSession =  await Connection.runTransaction(async (t)=> {
            if(!confirmedSession) {
                const sessionRes: _PublicLinkSession = await rootRepOpen(t.execute).insert({
                    'table': 'public_link_session',
                    params: {'id_public_link': linkId, 'session_value': uuid()}
                })
                confirmedSession = sessionRes;
            }
            await rootRepOpen(t.execute).insert({
                'table': 'public_link_usage',
                    params: {
                        'id_public_link': linkId, 
                        id_public_link_session: confirmedSession.id_public_link
                }
            }) 
            return confirmedSession
        })
        if(!sessionValue) {
            this.data.publicLinkSessionSessionValue = confirmedSession.session_value;
        }
    }
}