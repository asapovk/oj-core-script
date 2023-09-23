import moment from 'moment'

enum LogTypes {
    LOG,
    //Long time log
    LTL,
    INFO,
    WARN,
    ERROR
}

class Logger {

    private static format: string = 'YYYY-MM-DD HH:mm:ss.SSS'
    private static instance: Logger

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    private timestamp(): string {
        return moment().format(Logger.format)
    }

    private print(message: string, type: LogTypes): void {
        const pid = `${process.pid}`
        switch (type) {
            case LogTypes.LOG:
                if (process.env.LOGGER_LOG === "true") {
                    console.log(`${message}`)
                }
                break
            case LogTypes.LTL:
                console.log(`\x1b[34m${this.timestamp()} ${pid}[LTL]\x1b[0m`, message)
                break
            case LogTypes.ERROR:
                if (process.env.LOGGER_ERROR === "true") {
                    console.log(`\x1b[31m${this.timestamp()} ${pid}[ERROR]\x1b[0m`, message)
                }
                break
            case LogTypes.WARN:
                if (process.env.LOGGER_WARN === "true") {
                    console.log(`\x1b[33m${this.timestamp()} ${pid}[WARN]\x1b[0m`, message)
                }
                break
            case LogTypes.INFO:
            default:
                if (process.env.LOGGER_INFO === "true") {
                    console.log(`\x1b[32m${this.timestamp()} ${pid}[INFO]\x1b[0m`, message)
                }
        }
    }

    static info(message: string): void {
        Logger.getInstance().print(message, LogTypes.INFO)
    }

    static log(message: string): void {
        Logger.getInstance().print(message, LogTypes.LOG)
    }

    static ltl(message: string): void {
        Logger.getInstance().print(message, LogTypes.LTL)
    }

    static error(message: string): void {
        Logger.getInstance().print(message, LogTypes.ERROR)
    }

    static warn(message: string): void {
        Logger.getInstance().print(message, LogTypes.WARN)
    }
}

export default Logger
