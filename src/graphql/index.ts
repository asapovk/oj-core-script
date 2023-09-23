import { Query, Mutation } from '../generated/graphql'
import * as DbControllers from '../controllers/index'

type C = typeof DbControllers;

type Q = keyof Query;
type M = keyof Mutation

type IQResolverStrict = { [val in Q]: (val: any) => Promise<Query[val]> };
type IMResolverStrict = { [val in M]: (val: any) => Promise<Mutation[val]> };



class Resolver {
    private Query: IQResolverStrict
    private Mutation: IMResolverStrict

    constructor(controllers: C) {
        this.makeMutationObject(controllers)
    }

    private makeMutationObject = (controllers: C) => {
        let mutation: any = {}
        let query: any = {}
        for (let controller in controllers) {
            controllers[controller].makeQuery()
            controllers[controller].makeMutation()
            mutation = this.merge(mutation, controllers[controller].getMutation())
            query = this.merge(query, controllers[controller].getQuery())
        }
        this.Query = query
        this.Mutation = mutation
    }

    private merge = <T, K>(obj1: T, obj2: K): T & K => {
        return { ...obj1, ...obj2 }
    }

    public getResolver = () => {
        return {
            Query: this.Query,
            Mutation: this.Mutation
        }
    }

}
const mutObj = new Resolver(DbControllers).getResolver().Mutation
const queObj = new Resolver(DbControllers).getResolver().Query
console.log(mutObj)


export default new Resolver(DbControllers).getResolver()