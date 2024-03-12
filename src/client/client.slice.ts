import { BiteStatusWrap } from "@reflexio/core-v1/lib/types";
import { Slice, Bite } from "@reflexio/reflexio-on-redux";
import { _Users } from "../repository/entities";
import { _GroupA, _GroupInvite } from "../__boostorm/entities";
import { IState, ITriggers } from "../_redux/types";
import { LoadClients, __SelectUsersOfGroupsReturn } from "./scripts/LoadClients";
import { TriggerPhaseWrapper } from "@reflexio/reflexio-on-redux/lib/types";
import { LoadGroups } from "./scripts/LoadGroups";
import { CreateGroupService } from "./scripts/CreateGroup";
import { UpdateGroupService } from "./scripts/UpdateGroup";
import { CreateInviteService } from "./scripts/CreateInvite";
import { DeleteInviteService } from "./scripts/DeleteInvite";
import { UseGroupInviteService } from "./scripts/UseGroupInvite";
import { LoadInvites } from "./scripts/LoadInvites";
import { LoadPublicLinks, __SelectLinksOfGroupsReturn } from "./scripts/LoadPublicLinks";

export interface IClientTriggers {
    useGroupInvite: TriggerPhaseWrapper<{
        init: {
            input: {
                inviteToken: string;
                sessionToken: string;
            }
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: boolean;
            error?: string;
            requestId: string
        }
    }>
    manageMomentsGroup: TriggerPhaseWrapper<{
        init: {
            input: {
                groupId: number;
                addLinksIds: Array<number>;
                deleteLinksIds: Array<number>;
                sessionToken: string;
            }
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: boolean;
            error?: string;
            requestId: string
        }
    }>
    manageUsersGroup: TriggerPhaseWrapper<{
        init: {
            input: {
                groupId: number;
                addUsersIds: Array<number>;
                deleteUsersIds: Array<number>;
                sessionToken: string;
            }
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: boolean;
            error?: string;
            requestId: string
        }
    }>
    createInvite: TriggerPhaseWrapper<{
        init: {
            input: {
                inviteName: string;
                dtExpire?: string;
                groupId: number;
                sessionToken: string;
            }
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: _GroupInvite;
            error?: string;
            requestId: string
        }
    }>
    createGroup: TriggerPhaseWrapper<{
        init: {
            input: {
                groupName: string;
                sessionToken: string;
            }
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: number;
            error?: string;
            requestId: string
        }
    }>
    deleteInvite: TriggerPhaseWrapper<{
        init: {
            input: {
                inviteId: number;
                sessionToken: string;
            }
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: boolean;
            error?: string;
            requestId: string
        }
    }>
    updateGroup: TriggerPhaseWrapper<{
        init: {
            input: {
                groupId: number;
                isActive?: boolean;
                groupName?: string;
                sessionToken: string;
            }
            requestId: string;
        };
        done: {
            ok: boolean;
            data?: boolean;
            error?: string;
            requestId: string
        }
    }>
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
    loadInvites: TriggerPhaseWrapper<{
        init: {
            requestId: string;
            input: {
                groupId?: number;
                sessionToken: string;
            }
        };
        done: {
            requestId: string
            ok: boolean;
            data?: Array<_GroupInvite>;
            error?: string;
        }
    }>
    loadPublicLinks: TriggerPhaseWrapper<{
        init: {
            requestId: string;
            input: {
                groupId?: number;
                sessionToken: string;
            }
        };
        done: {
            requestId: string
            ok: boolean;
            data?: Array<__SelectLinksOfGroupsReturn>;
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
   }),
   //@ts-ignore
   'createGroup': Bite(null, {
                     //@ts-ignore
           'triggerStatus': 'init',
           'instance': 'refreshing',
                        //@ts-ignore
           'updateOn': ['createGroup'],
           'script': CreateGroupService
   }),
   //@ts-ignore
   'updateGroup': Bite(null, {
                     //@ts-ignore
           'triggerStatus': 'init',
           'instance': 'refreshing',
                        //@ts-ignore
           'updateOn': ['updateGroup'],
           'script': UpdateGroupService
    }),
      //@ts-ignore
   'createInvite': Bite(null, {
                     //@ts-ignore
           'triggerStatus': 'init',
           'instance': 'refreshing',
                        //@ts-ignore
           'updateOn': ['createInvite'],
           'script': CreateInviteService
    }),
        //@ts-ignore
   'deleteInvite': Bite(null, {
                     //@ts-ignore
           'triggerStatus': 'init',
           'instance': 'refreshing',
                        //@ts-ignore
           'updateOn': ['deleteInvite'],
           'script': DeleteInviteService
    }),
          //@ts-ignore
   'useGroupInvite': Bite(null, {
                     //@ts-ignore
           'triggerStatus': 'init',
           'instance': 'refreshing',
                        //@ts-ignore
           'updateOn': ['useGroupInvite'],
           'script': UseGroupInviteService
    }),
             //@ts-ignore
   'loadInvites': Bite(null, {
                     //@ts-ignore
           'triggerStatus': 'init',
           'instance': 'refreshing',
                        //@ts-ignore
           'updateOn': ['loadInvites'],
           'script': LoadInvites
    }),
                 //@ts-ignore
   'loadPublicLinks': Bite(null, {
                     //@ts-ignore
           'triggerStatus': 'init',
           'instance': 'refreshing',
                        //@ts-ignore
           'updateOn': ['loadPublicLinks'],
           'script': LoadPublicLinks
    }),
    }, null
    
);