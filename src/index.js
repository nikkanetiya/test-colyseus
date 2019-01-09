import path from 'path'
import express from 'express'
import serveIndex from 'serve-index'
// import WebSocket from 'uws'
import { createServer } from 'http'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import bodyParser from 'body-parser'
require('dotenv').config()

// Import demo room handlers
import { DefaultRoom } from './room'

const port = Number(process.env.PORT || 3006)
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  // engine: WebSocket.Server,
  server: createServer(app)
})

// Register CreateOrJoin as "default_room"
gameServer.register('default_room', DefaultRoom)

app.use('/', express.static(path.join(__dirname, 'static')))
app.use('/', serveIndex(path.join(__dirname, 'static'), { icons: true }))

// (optional) attach web monitoring panel
app.use('/colyseus', monitor(gameServer))

gameServer.onShutdown(function() {
  console.log(`game server is going down.`)
})

gameServer.listen(port)
console.log(`Listening on http://localhost:${port}`)
