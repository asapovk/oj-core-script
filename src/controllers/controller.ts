import { Query, Mutation } from '../generated/graphql'

type K = keyof Query;
type SK<X extends K> = Query[X];

type M = keyof Mutation;
type SM<X extends M> = Mutation[X];

type IQResolver = { [val in K]: (val: any) => Query[val] };
type IMResolver = { [val in M]: (val: any) => Mutation[val] };


abstract class Controller {

    protected queryResolvers: IQResolver
    protected mutationResolvers: IMResolver

    protected q: Query
    protected m: Mutation

    abstract makeQuery: (q: Query) => void
    abstract makeMutation: (m: Mutation) => void

    public createMutationResolver = <X extends M, Z, Y extends { headers: any }>(
        resolverName: X,
        func: (q: Z, ctx: any) => Promise<SM<X>>,
        middleHook: (ctx: Y) => any = () => { }
    ) => {
        const resolver = async (root, args: Z, context: Y, info) => {
            try {

                const middleRes = await middleHook(context)
                const funcRes = await func(args, middleRes) as any

                return funcRes
            }
            catch (err) {
                throw err
            }

        }
        this.mutationResolvers = { [resolverName]: resolver, ...this.mutationResolvers }
    }


    private merge = <T, K>(obj1: T, obj2: K): T & K => {
        return { ...obj1, ...obj2 }
    }

    public createQueryResolver = <X extends K, Z, Y extends { headers: any }>(
        resolverName: X,
        func: (q: Z, cxt: any) => Promise<SK<X>>,
        middleHook: (ctx: Y) => any = () => { }
    ) => {
        const resolver = async (root, args: Z, context: Y, info) => {
            try {
                const middleRes = await middleHook(context)
                const funcRes = await func(args, middleRes) as any

                return funcRes
            } catch (err) {

                throw err
            }
        }
        this.queryResolvers = this.merge({ [resolverName]: resolver }, this.queryResolvers)
    }
    public getMutation = () => this.mutationResolvers
    public getQuery = () => this.queryResolvers
}

export default Controller