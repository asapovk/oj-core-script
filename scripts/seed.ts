import { setConfig, connect } from '../src/__boostorm'
import {loadScript, saveScript} from  '../src/scripts/seedClient'


(async function run(){
    const config = require('../config/local.json')
    setConfig(config.ormconfig)
    connect()
    await saveScript()

})()