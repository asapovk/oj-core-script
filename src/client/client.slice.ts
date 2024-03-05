import { BiteStatusWrap } from "@reflexio/core-v1/lib/types";
import { Slice, Bite } from "@reflexio/core-v1";
import { _Users } from "../repository/entities";
import { _GroupA } from "../__boostorm/entities";
import { IState, ITriggers } from "../_redux/types";
import { LoadClients } from "./scripts/LoadClients";

export interface IClientTriggers {
    loadClients: BiteStatusWrap<{
        init: {
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: Array<_Users>;
            error?: string;
        }
    }>;
    loadGroups: BiteStatusWrap<{
        init: {
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: Array<_GroupA>;
            error?: string;
        }
    }>
}

export const clientsSlice = Slice<IClientTriggers, null, ITriggers, IState>(
    'clients', 
    {'loadClients': Bite(null, {
            'initOn': 'init',
            'instance': 'refreshing',
            'watchScope': [],
            'script': LoadClients
    }),
    'loadGroups': null
    }, null
);