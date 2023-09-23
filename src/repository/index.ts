import { OmitFields, PickAsArray, Repository as R } from '../__boostorm'
import Pg, { Executor } from '../__boostorm/Connection'
import { Repository } from '../__boostorm/types'
import schema, { Schema } from '../__boostorm/Schema';

export interface RepoType {

    // ///StatsDeep
    fetchInviteTokens: {
        params: { clientId: number, limit: number, offset: number },
        response: Array<any>
    }
    // fetchStatsPoints: {
    //     params: { statId?: number, statName?: string },
    //     response: Array<FetchStatsInfoReturn>
    // }
    // //Loader
    // fetchLoadTask: {
    //     params: {
    //         taskStatuses: Array<number>
    //         limit: number
    //     },
    //     response: Array<FetchLoadTaskReturn>
    // }
}




// export const repo: { [T in keyof RepoType]: (ex: Executor) => (args: RepoType[T]['params']) => Promise<RepoType[T]['response']> } = {
//    // 'fetchInviteTokens': (ex) => new InviteTokenRepository({ 'executor': ex, schema }).fetchInviteTokens,
// }

// export const repository: Repository = async (name, params) => {
//     const request = { ...repo as any }[name]
//     try {
//         return await request(Pg.execute)(params)
//     }
//     catch (err) {
//         throw err
//     }
// }



// export const repositoryOpen = (executor: Executor): Repository => async (name, params) => {
//     const request = { ...repo as any }[name]
//     try {
//         return await request(executor)(params)
//     }
//     catch (err) {
//         throw err
//     }
// }


export const rootRep = new R({
    schema,
    executor: Pg.execute
})

export const rootRepOpen = (ex: Executor) => new R({
    schema,
    executor: ex
})