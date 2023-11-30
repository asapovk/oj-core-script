import { ScriptInitArgsType, ScriptOptsType } from "@reflexio/reflexio-on-redux/lib/types";
import { IAuthTriggers } from "../auth.module";
import { IState, ITriggers } from "../../_redux/types";
import { rootRep, rootRepOpen } from "../../repository";
import { _GroupAPublicLinkJnt, _GroupAPublicLinkJntCreate, _PublicLink, _PublicLinkSession, _Sessions, _Users } from "../../__boostorm/entities";
import { AuthErrors } from "../auth.errors";
import { join } from "path";
import { Connection, JoinWhere, SubSelectForInsert } from "../../__boostorm";
import uuid from "uuid";
import { linkErrors } from "../link.errors";




export class CreatePublicLinkService {

    //getSerieByLink
    //isPublic - param

    constructor(private opts: ScriptOptsType<IAuthTriggers, ITriggers, IState, 'createPublicLink'>) {}
    
    private requestId: string;
    private err: string;
    private data: _PublicLink;

    private end() {
        this.opts.setStatus('done', {
            'err': this.err,
            'requestId': this.requestId,
            'ok': !Boolean(this.err),
            data: this.data,
        })
        this.opts.drop()
    }


    public async init(args: ScriptInitArgsType<IAuthTriggers, 'createPublicLink', 'start'>) {
    this.requestId = args.requestId;
        try {
        const tres = await Connection.runTransaction(async (t) => {
            const resLink: _PublicLink = await  rootRepOpen(t.execute).insert({
                'table': 'public_link',
                'params': {
                    'link_value': args.input.link_value,
                    'id_serie': args.input.serieId,
                    'start_second': args.input.start,
                    'end_second': args.input.end,
                    'dt_exprire': null,
                }
        })
        this.data = resLink;
        if(args.input.groupId) {
            const res: _GroupAPublicLinkJnt = await rootRepOpen(t.execute).insert({
                'table': 'group_a_public_link_jnt',
                'params': {
                    'id_public_link': resLink.id_public_link,
                    'id_group': args.input.groupId,
                },
                
            })
            }
        })
        //this.data = res;
        } catch (err) {
            this.err = 'SYSTEM_ERR'
        }
        if(!this.data) {
            this.err = linkErrors.LINK_DUBLICATE
        }
     
        this.end();
    }
}