/* eslint-disable import/first */
export {}
import express from 'express'
import http from 'http'
import path from 'path'
import cors from 'cors'
import GamesServer from './models/games-server'
import ServerRouter from './server-router'
import ServerSocketBattleship from '../utils/server-socket-battleship'

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
const server = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const gamesServer = new GamesServer()
const serverRouter = new ServerRouter(
    express.Router(),
    path,
    __dirname,
    gamesServer
)

const definedRouter = serverRouter.defineRoutes()
app.use(definedRouter)

const serverSocket = new ServerSocketBattleship(server, gamesServer)
serverSocket.setupSocket('http://localhost:3000') // TODO configure to have different environments
serverSocket.initSocket()

server.listen(3001, () => {
    console.log('listen 3001!')
})
