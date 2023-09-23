const dotenv = require('dotenv');
const path = require('path')
const pg = require('pg');
const fs = require('fs');
const process = require('process');
const { cwd } = require('process');


//const config = require('../config');
const Client = pg.Client;



const migrations = require(path.resolve(cwd(), 'migrations/indexs.js'));
const migrationsHistory = require(path.resolve(cwd(), 'migrations/history.json'));
const dbConfigs = require(path.resolve(cwd(), 'config/local.json'));

async function run() {
    const client = new Client(dbConfigs.ormconfig.connection)

    await client.connect()
    
    let newHistory = migrationsHistory
    for (let mg in migrations) {
        if (!newHistory.includes(mg)) {
            try {
                await runMigration(migrations[mg](), client)
            } catch (err) {
                console.log(err)
                break
            }
            console.log(`${mg} SUCCEEDED!`)
            newHistory.push(mg)
        }
    }
    fs.writeFileSync('migrations/history.json', JSON.stringify(newHistory, null, 4), 'utf-8')
    console.log(`DONE!`)
}


async function runMigration(queryString, client) {
    await client.query(queryString)
}

run()
