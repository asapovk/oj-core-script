
export type RequestTriggers<Inp, Output> = {
    init: {
        requestId: string;
        data: Inp;
    }
    done: {
        requestId: string;
        data: Output;
        err: string;
        ok: boolean;
    }
}