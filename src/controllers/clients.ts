import Controller from './controller'
import {Mutation, MutationCreateGroupArgs, MutationCreateInviteArgs, MutationDeleleInviteArgs, MutationManageGroupMomentArgs, MutationManageGroupUserArgs, MutationUpdateGroupArgs, MutationUpdateScriptArgs, MutationUseGroupInvieteArgs, Query, QueryClientsArgs, QuerySingleSerieArgs } from '../generated/graphql'
import appStore from '../_redux/app-store'
import {v4} from 'uuid'

class ClientsController extends Controller {
    makeMutation = (m: Mutation) => {
        this.createMutationResolver('useGroupInviete', async (args:MutationUseGroupInvieteArgs, auth: string ) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('createGroup', 'init', 'done', {
                requestId,
                input: {
                    'groupName': args.input.inviteToken,
                    sessionToken: auth
                }
            })
            if(res.ok) {
                return true
            }
            else {
                throw Error(res.error);
            }
        })
        this.createMutationResolver('createGroup', async (args: MutationCreateGroupArgs, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('createGroup', 'init', 'done', {
                requestId,
                input: {
                    'groupName': args.input.groupName,
                    sessionToken: auth
                }
            })
            if(res.ok) {
                return res.data
            }
            else {
                throw Error(res.error);
            }
        })
        this.createMutationResolver('updateGroup', async (args: MutationUpdateGroupArgs, auth: string)=> {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('updateGroup', 'init', 'done', {
                requestId,
                input: {
                    'groupName': args.input.groupName,
                    'groupId': args.input.groupId,
                    'isActive': args.input.isActive,
                    sessionToken: auth
                }
            })
            if(res.ok) {
                return res.data
            }
            else {
                throw Error(res.error);
            }
        })
        this.createMutationResolver('deleleInvite', async (args: MutationDeleleInviteArgs, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            return true
            
        })
        this.createMutationResolver('createInvite', async (args: MutationCreateInviteArgs, auth: string)=> {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('createInvite', 'init', 'done', {
                requestId,
                input: {
                    groupId: args.input.groupId,
                    sessionToken: auth
                }
            })
            if(res.ok) {
                return {
                    'inviteId': res.data.id_group_invite,
                    'token': res.data.invite_token,
                    'dtCreate': res.data.dt_create.toUTCString(),
                    'useCount': 0,
                    'plan': 'regular',
                    'status': null
                }
            }
            else {
                throw Error(res.error);
            }
        })
        this.createMutationResolver('manageGroupMoment', async (args: MutationManageGroupMomentArgs, auth: string)=> {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            return true
        })
        this.createMutationResolver('manageGroupUser', async (args: MutationManageGroupUserArgs, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            return true
        })
    }
    makeQuery = (q: Query) => {
        this.createQueryResolver('clients', async (args: QueryClientsArgs, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('loadClients', 'init', 'done', {
                requestId,
                input: {
                    'groupId': args.input.groupId,
                    sessionToken: auth
                }
            })
            if(res.ok) {
                return res.data.map( r => ({
                    'group': {
                        'groupId': r.groupAIdGroupA,
                        'dtCreate': r.groupADtCreate.toISOString(),
                        'groupName': r.groupAGroupName
                    },
                    'userId': r.usersUserId,
                    'username': r.usersUsername,
                    'email': r.usersEmail,
                    'phone':r.usersPhone,
                    'password': r.usersPassword,
                    'dtCreate': 'data_fake'
                }));
            }
            else {
                throw Error(res.error);
            }
        },(args) => args.headers.authorization)
        this.createQueryResolver('groups', async (args: {}, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('loadGroups', 'init', 'done', {
                requestId,
                input: { sessionToken: auth}
                
            })
            if(res.ok) {
                return res.data.map(r => ({
                    'groupId': r.id_group_a,
                    'groupName': r.group_name,
                    'dtCreate': r.dt_create.toISOString(),
                }))
            }
            else {
                throw Error(res.error);
            }
        },(args) => args.headers.authorization)
    }
}


export default new ClientsController()