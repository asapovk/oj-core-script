import { InitArgsType, ScriptOptsType,  } from "@reflexio/core-v1/lib/types";
import { TriggerPhaseKeys } from "@reflexio/core-v1/lib/types";
import { IRepository } from "../__boostorm/Repository";


export  abstract class ServiceScript
    <RTg, RSt, Bitename extends keyof RTg, PhK extends TriggerPhaseKeys<RTg, Bitename>, Inj = unknown> {
    constructor(opts) {
        this.opts = opts;
        this.dao =  opts.addOpts.dao;
    }    
    protected opts: ScriptOptsType<RTg, RSt, Bitename, Inj>;
    protected dao: IRepository;
    protected requestId: string;
    //@ts-ignore
    abstract request (args: InitArgsType<RTg, Bitename, PhK>): Promise<InitArgsType<RTg, Bitename, 'done'>['data']>;

    protected async  init(args: InitArgsType<RTg, Bitename, PhK> & {requestId: string}): Promise<void> {
        this.requestId  = args.requestId;
        let result = null;
        let err = null; 
        try {
            result  = await this.request(args);
            console.log(result);
        } catch(err) {
            console.log(err);
            err = 'error';
        }
        //@ts-ignore
        this.opts.setStatus('done', {
            requestId: this.requestId,
            data: result,
            err,
            ok: !Boolean(err)
        });
    };
}