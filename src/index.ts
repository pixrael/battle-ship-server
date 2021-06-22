export {}

const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const cors = require('cors')

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
const server = http.createServer(app)

const { initSocket } = require('../utils/serverio')
initSocket(server, 'http://localhost:3000') // TODO: should depends of the environment

const router = require('./routes')

app.use(express.json())

app.use(router)

server.listen(3001, () => {
    console.log('listen 3001')
})
