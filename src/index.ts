import dotenv from 'dotenv';
import path from 'path'
import { connect, setConfig } from './__boostorm'
import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import busboy from 'connect-busboy'
import { ApolloServer, gql} from 'apollo-server-express'

import { importSchema } from 'graphql-import'
import resolvers from './graphql'


const app = express()
const port = process.env.APP_PORT || 4001
const typeDefs = gql`${importSchema(path.join(__dirname, "graphql", "schema.graphql"))}`
// const admTypeDefs = gql`${importSchema(path.join(__dirname, "admGraphql", "schema.graphql"))}`

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(busboy());
app.use(compression());

//Start listening at API endpoints

const configPath = path.join(__dirname, '../config/production.json')
const config = require(configPath)

const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({ req }: any) => {
        const remoteIp = req.headers["x-real-ip"] || req.ip
        const gRecaptchaResponse = req.headers["g-recaptcha-response"]
        const verifyCode = req.headers["code"]
        return {
            headers: req.headers,
            remoteIp,
            gRecaptchaResponse,
            verifyCode,
        }
    },

    /**
     * GraphQL error handling converts new Error(code) 
     * to errorDefinitions object
     * ignore formatted gql, we use standart Error
     */
    formatError: (error) => {
        if (error.message && error.message.match("{")) {
            try { return JSON.parse(error.message) } catch (error) { }
        }
        return error
    },

    /**
     * Turns on Graphql playground 
     * if instance is not production
     */
    debug: true,//process.env.APOLLO_DEBUG == 'true',
    playground: true//process.env.PLAYGROUND == 'true',
})



app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
apolloServer.applyMiddleware({
    app,
    path: "/graphql"
})
setConfig(config.ormconfig)
connect()
app.listen({ port }, async () => {
    console.log(`\x1b[36mEBIRD READY AT ${port}\x1b[0m 🐥🐣🐥`)
})                                                                                                                        