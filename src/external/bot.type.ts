


export interface TriggerLinkInput {
    link: string,
    source_info?: string
}

export interface ClientPayedNotifyInput {
    clintCoreId: string
}

export interface ClientStopReccurentNotify {
    clintCoreId: string
}



export interface ClientRegisteredNotify {
    clintCoreId: string
    dtSignUp: string
    phone?: string
}


