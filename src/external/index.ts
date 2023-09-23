import Axios, { AxiosResponse, AxiosError } from 'axios'





export type Response<R> = {
    status: number | null
    statusText: string | null
    response: R | null
    error: string | null
}


class External {

    private baseUsr: string

    constructor(baseUrl: string) {
        this.baseUsr = baseUrl
    }

    public async request(method: 'GET' | 'POST' | 'PUT' | 'DELETE', uri: string, data?: { [key: string]: any }): Promise<Response<any>> {

        let r: Response<unknown> = {
            error: null,
            response: null,
            status: null,
            statusText: null
        }

        // const headers: any = {
        //     'X-Signature': signature
        // }

        // if (this.bridge.basic) {
        //     headers.Authorization = 'Basic ' + this.bridge.basic
        // }

        // const httpsAgent = new https.Agent({
        //     cert: this.bridge.cert,
        //     key: this.bridge.certKey,
        //     ca: this.bridge.ca
        // });
        const instance = Axios.create({
            baseURL: this.baseUsr
            //headers,
            //httpsAgent,
        })
        // 'http://localhost:7676/api/service'
        //https://тестконнект.смородина.онлайн/kktgate/api/service
        try {
            let res: AxiosResponse | null = null
            if (method === 'GET') {
                res = await instance.get(uri)
            }
            if (method === 'POST') {
                res = await instance.post(uri, data)
            }
            if (method === 'PUT') {
                res = await instance.put(uri, data)
            }
            if (method === 'DELETE') {
                res = await instance.delete(uri)
            }

            if (res) {
                r = { ...r, response: res.data, status: res.status, statusText: res.statusText }
            }

            //return res ? res.data : null
        } catch (error) {
            const aerr: AxiosError = error
            if (aerr.response && aerr.response.status) {
                r = { ...r, status: aerr.response.status, statusText: aerr.response.statusText }
            }

            if (aerr.response && aerr.response.data) {
                if (typeof aerr.response.data === 'object') {
                    r = { ...r, error: JSON.stringify(aerr.response.data) }
                }
                else {
                    r = { ...r, error: aerr.response.data }
                }
            }
            else {
                // Logger.error(error.message)
                r = { ...r, error: aerr.message }
            }
        }
        finally {
            return r
        }
    }

}

export default External


export function RequiredField(target: any, propertyKey: string) {
    if (!target.rules) {
        target.rules = [{ message: `${propertyKey} is required`, key: propertyKey }]
    }
    else {
        target.rules.push({ message: `${propertyKey} is required`, key: propertyKey })
    }
    // let service: UserService;
    return target
    //return Reflect.getMetadata(formatMetadataKey, target, propertyKey);

};



export function ReturnType(constructor: Function) {

    constructor.prototype.validate = function (args: object) {

        if (this.rules) {
            for (let r of this.rules) {
                if (!args[r.key]) {
                    console.log(r.message)
                }
            }
        }
    }
}

