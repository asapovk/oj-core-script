import { Script } from "@reflexio/core-v1/lib/Script"
import { IState, ITriggers } from "../../_redux/types";
import { ScriptOptsType, WatchArgsType } from "@reflexio/core-v1/lib/types";


export class LoadClients extends Script<ITriggers, IState, 'loadClients', 'init', null> {
    public opts: ScriptOptsType<ITriggers, IState, "loadClients", null>;

    constructor(opts) {
        super()
        this.opts = opts
    }
    
    init(args: null): void {
        
    }

    watch(args: WatchArgsType<ITriggers, "loadClients">): void {
            
    }

}