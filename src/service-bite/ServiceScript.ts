import { Script } from "@reflexio/core-v1/lib/Script";
import { BiteStatusWrap, GetByKey, InitArgsType, ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";
import { TriggerPhaseKeys } from "@reflexio/core-v1/lib/types";
//import { rootRep } from "../repository";
import { Repository } from "../__boostorm";
import { rootRep } from "../repository";


export  abstract class ServiceScript<RTg, RSt, Bitename extends keyof RTg, PhK extends TriggerPhaseKeys<RTg, Bitename>, Inj = unknown> {
    protected opts: ScriptOptsType<RTg, RSt, Bitename, Inj>;
    protected dao: Repository;
    protected requestId: string;
    abstract request (args: InitArgsType<RTg, Bitename, PhK>): Promise<void>;


    //abstract watch(args: WatchArgsType<RTg, Bitename>): void;
    //abstract init(args: InitArgsType<RTg, Bitename, PhK>): void;


    constructor(opts) {
        this.opts = opts;
        this.dao =  opts.addOpts.dao;
    }

    protected async  init(args: InitArgsType<RTg, Bitename, PhK> & {requestId: string}): Promise<void> {
        this.requestId  = args.requestId;
        let result = null;
        let err = null; 
        try {
            result  = await this.request(args);
        } catch(err) {
            console.log(err);
            err = 'error';
        }
        //@ts-ignore
        this.opts.setStatus('done', {
            requestId: this.requestId,
            data: result,
            err,
        });
    };
}