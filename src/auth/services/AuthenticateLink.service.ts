import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { IAuthTriggers } from "../auth.module";
import { IState, ITriggers } from "../../_redux/types";
import { rootRep } from "../../repository";
import { _PublicLink, _PublicLinkSession, _Sessions, _Users } from "../../__boostorm/entities";
import { AuthErrors } from "../auth.errors";
import { join } from "path";
import { JoinWhere, SubSelectForInsert } from "../../__boostorm";
import uuid from "uuid";
import { linkErrors } from "../link.errors";


export interface AuthenticateReturn_ {
    publicLinkDtExprire: Date | null,
    publicLinkStartSecond: string | null,
    publicLinkEndSecond: string | null,
    publicLinkIdSerie: number,
    publicLinkSessionSessionValue: string
}

export class AuthenticateLinkService {

    //getSerieByLink
    //isPublic - param

    constructor(private opts: ScriptOptsType<IAuthTriggers, ITriggers, IState, 'authenticateLink'>) {}
    
    private requestId: string;
    private err: string;
    private data: AuthenticateReturn_;

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
    
    if(args.input.link_session) {
        try {
        const res: Array<any> = await rootRep.select({
            'from': 'public_link',
            where: {
                'link_value': args.input.link_value,
            },
            select: {
                'columns': ['dt_exprire', 'start_second', 'end_second', 'id_serie']
            },
            'join': {
                'public_link_session': {
                    'on': {
                        'left': 'id_public_link',
                        'operator': '=',
                        'right': 'id_public_link'
                    },
                    select: ['session_value'],
                    'where': {
                        'session_value': args.input.link_session
                    }
                }
            },
            limit: 1,
            offset: 0
        })
            if(!res.length) {
                this.err = linkErrors.INVALID_SESSION;
            }
            else {
                const expirationDate = res[0].publicLinkDtExprire;
                if(expirationDate && (new Date >  new Date(expirationDate))) {
                    this.err = linkErrors.LINK_EXIRED;
                    this.end();
                };
                this.data = res[0]
                
            }
            this.end();

        } catch(err) {
            this.err = linkErrors.LINK_SYSTEM_ERR;
            this.end();
        }
    }

    if(!args.input.link_session) {
        try {
            const insertResuot = await rootRep.insert({
                'table': 'public_link_session',
                'params': {
                    'id_public_link': SubSelectForInsert({
                        'table': 'public_link',
                        'select': 'id_public_link',
                        'where': {
                            'link_value': args.input.link_value
                        }
                    }),
                    'session_value': uuid(),
                },
            })
            this.data = insertResuot;
            this.end();
         } catch(er) {   
            this.err = linkErrors.INVALID_LINK;
            this.end()
         }

    }

    }
}