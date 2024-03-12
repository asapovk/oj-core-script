import Controller from './controller'
import {Mutation, MutationCreateGroupArgs, MutationCreateInviteArgs, MutationDeleleInviteArgs, MutationManageGroupMomentArgs, MutationManageGroupUserArgs, MutationUpdateGroupArgs, MutationUpdateScriptArgs, MutationUseGroupInvieteArgs, Query, QueryClientsArgs, QueryInvitesArgs, QueryPublicLinksArgs, QuerySingleSerieArgs } from '../generated/graphql'
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
        },(args) => args.headers.authorization)
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
        },(args) => args.headers.authorization)
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
                return true
            }
            else {
                throw Error(res.error);
            }
        },(args) => args.headers.authorization)
        this.createMutationResolver('deleleInvite', async (args: MutationDeleleInviteArgs, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('deleteInvite', 'init', 'done', {
                requestId,
                input: {
                    inviteId: args.input.inviteId,
                    sessionToken: auth
                }
            })

            if(res.ok) {
                return true
            }
            else {
                throw Error(res.error);
            }
            
        },(args) => args.headers.authorization)
        this.createMutationResolver('createInvite', async (args: MutationCreateInviteArgs, auth: string)=> {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('createInvite', 'init', 'done', {
                requestId,
                input: {
                    'dtExpire': args.input.dtExpire,
                    'inviteName': args.input.nameInvite,
                    groupId: args.input.groupId,
                    sessionToken: auth
                }
            })
            if(res.ok) {
                return {
                    'inviteId': res.data.id_group_invite,
                    'token': res.data.invite_token,
                    'dtCreate': res.data.dt_create.toUTCString(),
                    'useCount': res.data.use_cnt,
                    'plan': 'regular',
                    'status': null
                }
            }
            else {
                throw Error(res.error);
            }
        },(args) => args.headers.authorization)
        this.createMutationResolver('manageGroupMoment', async (args: MutationManageGroupMomentArgs, auth: string)=> {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('manageMomentsGroup', 'init', 'done', {
                requestId,
                input: {
                    'groupId': args.input.groupId,
                    'deleteLinksIds': args.input.deleteMomentIds,
                    'addLinksIds': args.input.addMomentIds,
                    sessionToken: auth
                }
            })
            if(res.ok) {
                return true
            }
            else {
                throw Error(res.error);
            }
        },(args) => args.headers.authorization)
        this.createMutationResolver('manageGroupUser', async (args: MutationManageGroupUserArgs, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('manageUsersGroup', 'init', 'done', {
                requestId,
                input: {
                    'groupId': args.input.groupId,
                    'deleteUsersIds': args.input.deleteUserIds,
                    'addUsersIds': args.input.addUserIds,
                    sessionToken: auth
                }
            })
            if(res.ok) {
                return true
            }
            else {
                throw Error(res.error);
            }
        },(args) => args.headers.authorization)
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
                    'dtExpire': r.groupAUserJntDtExpire ? r.groupAUserJntDtExpire.toISOString(): null,
                    'userId': r.usersUserId,
                    'username': r.usersUsername,
                    'email': r.usersEmail,
                    'phone':r.usersPhone,
                    'password': r.usersPassword,
                    'dtCreate': 'fake_date'
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
        this.createQueryResolver('invites', async (args: QueryInvitesArgs, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('loadInvites', 'init', 'done', {
                requestId,
                input: { sessionToken: auth, 'groupId': args.input.groupId }
                
            })
            if(res.ok) {
                return res.data.map(r => ({
                    'inviteId': r.id_group_invite,
                    'groupId': r.id_group,
                    'token': r.invite_token,
                    'useCount': r.use_cnt,
                    'plan': 'regular',
                    'name': r.name_invite,
                    'dtExpire': r.dt_expire ? r.dt_expire.toISOString():  null,
                    'dtCreate': r.dt_create.toISOString(),
                    
                }))
            }
            else {
                throw Error(res.error);
            }
        },(args) => args.headers.authorization)
        this.createQueryResolver('publicLinks', async (args: QueryPublicLinksArgs, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('loadPublicLinks', 'init', 'done', {
                requestId,
                input: { sessionToken: auth, 'groupId': args.input.groupId }
                
            })
            if(res.ok) {
                return res.data.map(r => ({
                 'dtCreate':  r.groupAPublicLinkJntDtCreate.toISOString(),
                 'linkId': r.publicLinkIdPublicLink,
                 'linkValue': r.publicLinkLinkValue,
                 'isAuthRequired': r.publicLinkIsAuthRequired,
                 'group': {
                    'groupId': r.groupAIdGroupA,
                    'groupName': r.groupAGroupName,
                    'dtCreate': r.groupADtCreate.toISOString(),

                 },
                }))
            }
            else {
                throw Error(res.error);
            }
        },(args) => args.headers.authorization)
    }
}


export default new ClientsController()