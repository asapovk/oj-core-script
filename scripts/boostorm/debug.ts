import { launch, setConfig, connect } from '../../src/__boostorm'
import path from 'path'

(async function main() {
    const configPath = path.join(__dirname, '../../config/local.json')
    const config = require(configPath)
    setConfig(config.ormconfig)
    //connect()
    await launch(true)

})()