import rtg from '../../__boostorm/script/ReturnTypeGenerator'
import { RepoType } from '..'

export type RepoParamsType = { [P in keyof RepoType]: RepoType[P]['params'] }


export function R<T extends keyof RepoParamsType>(a: T, args: RepoParamsType[T], debug?: boolean) {
    return function (target: any, key: string) {
        //const rtg = RtgI.getReturnTypeGenerator()
        if (rtg) {
            rtg.pushRmethod(
                {
                    f: key,
                    args,
                    debug: debug
                }
            )
        }
        else {
            console.log('R is null')
        }
        return target
    }
}
