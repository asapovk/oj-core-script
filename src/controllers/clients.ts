import Controller from './controller'
import {Mutation, MutationUpdateScriptArgs, Query, QuerySingleSerieArgs } from '../generated/graphql'
import appStore from '../_redux/app-store'
import {v4} from 'uuid'

class ClientsController extends Controller {
    makeMutation = (m: Mutation) => {
    }
    makeQuery = (q: Query) => {
        this.createQueryResolver('clients', async (args: {}, auth: string) => {
            const requestId = v4();
            if(!auth) {
                throw Error('MISSING_AUTH_TOKEN');
            }
            const res =  await appStore.hook('loadClients', 'init', 'done', {
                requestId,
            })
            if(res.ok) {
                return [];
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
            })
            if(res.ok) {
                return [];
            }
            else {
                throw Error(res.error);
            }
        },(args) => args.headers.authorization)
    }
}


export default new ClientsController()