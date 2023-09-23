

export interface ServiceConfig {
    serviceName: string
    instance: 'stable' | 'refreshing'
    service: any;
    dependsOn: Array<string>
}