//import { _Client, _ClientAccount } from "../repository/entities"
import { rootRep, rootRepOpen } from "../repository"
import { Connection } from "../__boostorm"
import { _ScriptsProcessed } from "../__boostorm/entities"
import * as fs from 'fs'
export const  seedClient = async () => {
    
    // await Connection.runTransaction(async t => {
    //     const client: _Client = await rootRepOpen(t.execute).insert({
    //         'table': 'client',
    //         'params': {
    //             'contact_email': 'asapovk@gmail.com',
    //             'contact_phone': '+79166064613',
    //             'first_name': 'Konstantin',
    //             'last_name': 'Astapov',
    //             'username': 'k.astapov',
    //             'img_url': null
    //         }
    //     })
    // })
} 

export const saveScript = async () => {
    const script = require( __dirname + '/script_body.json')
    //console.log(script);
    await rootRep.insert({
        'table': 'scripts_processed',
        'params': {
            'ru_body': null,
            serie_id:1524,
            'body': script
        },
    })
}

export const loadScript = async () => {
    const scripts: Array<_ScriptsProcessed> = await rootRep.fetch({
        'table': 'scripts_processed',
        where: {
            'serie_id': 1524,
        },
        'limit': 1,
        offset: 0
    })
    console.log(scripts);
    if(scripts.length) {
        const body = scripts[0].body;
        console.log(body)
        if(body) {
            fs.writeFile(
                __dirname + '/script_body.json',
                JSON.stringify(body, null, 2),
                function (err) {
                  if (err) {
                    console.log(err);
                  }
                }
              );
        }
    }
}