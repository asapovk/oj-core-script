import { BiteStatusWrap } from "@reflexio/core-v1/lib/types";
import { Slice, Bite } from "@reflexio/reflexio-on-redux";
import { _Users } from "../repository/entities";
import { _GroupA } from "../__boostorm/entities";
import { IState, ITriggers } from "../_redux/types";
import { LoadClients, __SelectUsersOfGroupsReturn } from "./scripts/LoadClients";
import { TriggerPhaseWrapper } from "@reflexio/reflexio-on-redux/lib/types";
import { LoadGroups } from "./scripts/LoadGroups";

export interface IClientTriggers {
    loadClients: TriggerPhaseWrapper<{
        init: {
            input: {
                groupId?: number;
                sessionToken: string;
            }
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: Array<__SelectUsersOfGroupsReturn>;
            error?: string;
            requestId: string
        }
    }>;
    loadGroups: TriggerPhaseWrapper<{
        init: {
            requestId: string;
            input: {
                sessionToken: string;
            }
        };
        done: {
            requestId: string
            ok: boolean;
            data?: Array<_GroupA>;
            error?: string;
        }
    }>
}

export const clientsSlice = Slice<IClientTriggers, ITriggers, null, IState>(
    'clients', 
    //@ts-ignore
    {'loadClients': Bite(null, {
         //@ts-ignore
            'triggerStatus': 'init',
            'instance': 'refreshing',
             //@ts-ignore
            'updateOn': ['loadClients'],
            'script': LoadClients
    }),
                 //@ts-ignore
    'loadGroups':  Bite(null, {
                     //@ts-ignore
           'triggerStatus': 'init',
           'instance': 'refreshing',
                        //@ts-ignore
           'updateOn': ['loadGroups'],
           'script': LoadGroups
   })
    }, null
);