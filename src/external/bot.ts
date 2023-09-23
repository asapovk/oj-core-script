import Axios, { AxiosResponse, AxiosError } from 'axios'
import External, { Response } from '.'
import { ClientRegisteredNotify, TriggerLinkInput, ClientPayedNotifyInput, ClientStopReccurentNotify } from './bot.type'
const config = require('../../config/local.json');



class BotExternal extends External {

    constructor(url: string) {
        super(url)
    }

    public async triggerLink(args: TriggerLinkInput): Promise<Response<string>> {
        console.log(args)
        const res = await this.request('POST', `/trigger_link`, args)
        // var n = new KktGateApiRes()
        // //@ts-ignore
        // n.validate(res.response)
        console.log(res)
        return res
    }



    public async clientPayedNotify(args: ClientPayedNotifyInput): Promise<Response<string>> {
        console.log(args)
        const res = await this.request('POST', `/client_payed_notify`, args)
        // var n = new KktGateApiRes()
        // //@ts-ignore
        // n.validate(res.response)
        console.log(res)
        return res
    }


    public async clientStopReccurentNotify(args: ClientStopReccurentNotify): Promise<Response<string>> {
        console.log(args)
        const res = await this.request('POST', `/client_stop_reccurent_notify`, args)
        // var n = new KktGateApiRes()
        // //@ts-ignore
        // n.validate(res.response)
        console.log(res)
        return res
    }

    public async clientRegisteredNotify(args: ClientRegisteredNotify): Promise<Response<string>> {
        console.log(args)
        const res = await this.request('POST', `/client_registered_notify`, args)
        // var n = new KktGateApiRes()
        // //@ts-ignore
        // n.validate(res.response)
        console.log(res)
        return res
    }




}

export default new BotExternal(config.webApi.botBaseUrl)