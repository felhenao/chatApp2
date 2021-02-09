const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public' )

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    socket.on('join', ({ username, room }) => {
        socket.join(room)
        socket.emit('message', generateMessage('Welcome!'))//emits to single client when new client connects 
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))//emits to all (except current) clients
        //socket.emit, io.emit, socket.broadcast.emit, io.to.emit, socket.broadcast.to.emit
    })

    socket.on('sendMessage', (message, callback) => {
        io.to('Pair Programming').emit('message', generateMessage(message))  //emit to all clients
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`) )
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
