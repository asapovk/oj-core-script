const dotenv = require('dotenv');
const path = require('path')
const pg = require('pg'); 
const fs = require('fs');


// let envPath = "";

// for (let i = 0; i < process.argv.length; i++) {
//     if (process.argv[i] === "-env") {
//         envPath = path.resolve(process.cwd(), process.argv[i + 1])
//     }
// }
// if (!envPath) {
//     console.error('-env should be a path for config file');
//     process.exit(0);
// }

// if (!fs.existsSync(envPath)) {
//     console.error('-env file not exist at path ' + envPath);
//     process.exit(0);
// }

// dotenv.config({
//     path: envPath,
//     debug: process.env.ENV === "debug"
// });


//const config = require('../config');
const Client = pg.Client;


async function run() {
    const dbConfigs = require(path.resolve(process.cwd(), 'config/production.json'));
    console.log(dbConfigs);
    console.log('run');
    const client = new Client(dbConfigs.ormconfig.connection)
    try {
        await client.connect()
    }
    catch(err) {
        console.log(err);
    }
    console.log(client);

    const resTables = await getAllTables(client);
    const resForeignKeys = await getForeignKeys(client)


    for (let t of resTables) {

        let primary_key = ''
        let joins = []
        let joinsColums = []
        const foundTablesFor = resForeignKeys.filter(ft => ft.foreign_table_name === t.table_name)
        const foundTablesMy = resForeignKeys.filter(ft => ft.table_name === t.table_name)

        const nextval_col = t.columns.find(c => c.column_default && c.column_default.includes('nextval'))
        if (nextval_col) {
            primary_key = nextval_col.column_name
        }

        for (let ftF of foundTablesFor) {
            if (!joins.includes(ftF.table_name)) {
                joins.push(ftF.table_name)
                joinsColums.push({
                    table_name: ftF.table_name,
                    left_column: ftF.column_name, //table to join to
                    right_column: ftF.foreign_column_name
                })
            }
        }

        for (let ftF of foundTablesMy) {
            if (!joins.includes(ftF.foreign_table_name)) {
                joins.push(ftF.foreign_table_name)
                joinsColums.push({
                    table_name: ftF.foreign_table_name,
                    left_column: ftF.foreign_column_name, //table to join to
                    right_column: ftF.column_name
                })
            }
        }


        t.joins = joins
        t.joinsColums = joinsColums
        t.primary_key = primary_key
    }

    let tdsString = '';


    for (t of resTables) {
        tdsString += `${getDTS(t)}
    
        ${getDTSCreate(t)}
        `
    }
    tdsString += `
    ${genEntitieType(resTables)}
    `
    fs.writeFileSync('src/repository/dbSchema.json', JSON.stringify(resTables, null, 4), 'utf-8')
    fs.writeFileSync('src/repository/entities.d.ts', tdsString, 'utf-8')
    client.end()
}
try {
    run();
}
catch (err) {
    console.log(err);
}


async function getAllTables(client) {
    const query = `
    with cols as (
        select  column_name, data_type, is_nullable, column_default, table_name 
        from information_schema.columns
    )
    SELECT t.table_name, json_agg(tc.*) as columns
    FROM information_schema.tables t
    JOIN cols tc on tc.table_name = t.table_name 
    WHERE t.table_schema = 'public'
    group by t.table_name
    `
    try {
        const res = await client.query(query)
        return res.rows
    } catch (err) {
        console.log(err)
    }
}

async function getForeignKeys(client) {
    const query = `
    SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY';
    `
    try {
        const res = await client.query(query)
        return res.rows
    } catch (err) {
        console.log(err)
    }
}

async function getPrimaryKeys(client) {
    const query = `
    SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY';
    `
    try {
        const res = await client.query(query)
        return res.rows
    } catch (err) {
        console.log(err)
    }
}





function genEntitieType(tables) {
    let begining = `
    export interface _Entities {
    `
    let middle = ''
    for (t of tables) {
        let tableName = t.table_name
        let typename = t.table_name.split('_').map(n => n.length ? n[0].toUpperCase() + n.substring(1, n.length) : n).join('')

        let add_str = `
            ${tableName}: {
                entitie: _${typename}
                create: _${typename}Create
                joins: ${t.joins.length ? t.joins.map(j => `'${j}'`).join(' | ') : `''`}
            }

        `
        middle += add_str
    }
    let ending = `
    }
    `
    return `
    ${begining}
    ${middle}
    ${ending}
    `
}



function genTYpeFromColumn(col) {

    let type;
    let is_null = '';

    if ((col.data_type === 'text') || (col.data_type.includes('character'))) {
        type = 'string'
    }

    if (col.data_type.includes('timestamp')) {
        type = 'Date'
    }

    if (col.data_type === 'integer' || col.data_type === 'smallint') {
        type = 'number'
    }

    if (col.data_type.includes('json')) {
        type = 'JSON'
    }

    if (col.is_nullable === 'YES') {
        is_null = '| null'
    }

    return `${col.column_name}: ${type} ${is_null}`
}



function getDTS(table) {

    let typename = table.table_name.split('_').map(n => n.length ? n[0].toUpperCase() + n.substring(1, n.length) : n).join('')

    let begining = `
    export interface _${typename} {
    `
    let middle = '';
    for (col of table.columns) {
        middle += ` 
                    ${genTYpeFromColumn(col)}
                    `
    }
    let end = `
    }
    `

    return `${begining} 
    ${middle}
    ${end}
    `
}

function getDTSCreate(table) {

    let typename = table.table_name.split('_').map(n => n.length ? n[0].toUpperCase() + n.substring(1, n.length) : n).join('')

    let begining = `
    export interface _${typename}Create {
    `
    let middle = '';
    //let defaultColumns = table.columns.filter(c => c.column_default !== null)
    let colsCreate = table.columns.filter(c => c.column_default === null)
    for (col of colsCreate) {
        middle += ` 
                    ${genTYpeFromColumn(col)}
                    `
    }
    let end = `
    }
    `

    return `${begining} 
    ${middle}
    ${end}
    `
}

function getDTSUpdate(table) {

    let typename = table.table_name.split('_').map(n => n.length ? n[0].toUpperCase() + n.substring(1, n.length) : n).join('')

    let begining = `
    export interface _${typename}Cretate {
    `
    let middle = '';
    //let defaultColumns = table.columns.filter(c => c.column_default !== null)
    let colsCreate = table.columns.filter(c => c.column_default === null)
    for (col of colsCreate) {
        middle += ` 
                    ${genTYpeFromColumn(col)}
                    `
    }
    let end = `
    }
    `

    return `${begining} 
    ${middle}
    ${end}
    `
}