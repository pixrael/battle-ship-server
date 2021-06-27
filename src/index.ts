export {}
// eslint-disable-next-line import/first
import GamesServer from './models/games-server'

const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const cors = require('cors')

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
const server = http.createServer(app)

const router = require('./routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)

// eslint-disable-next-line import/prefer-default-export
export const gameServer = new GamesServer()

const { initSocket } = require('../utils/serverio')
initSocket(server, 'http://localhost:3000', gameServer) // TODO: should depends of the environment

server.listen(3001, () => {
    console.log('listen 3001')
})
