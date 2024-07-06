import { Bite } from '@reflexio/core-v1';


export function biteRequest<Tg, St, K extends keyof Tg, RTg>(biteName: K, script: any, props?: any) {
  return Bite<Tg, St, K, RTg>({} as any, {
    watchScope: [biteName as any],
    instance: 'refreshing',
    script,
    addOpts: props,
    initOn: 'init' as any,
  } as any);
}
