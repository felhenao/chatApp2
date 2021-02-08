const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public' )

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    socket.emit('message', 'Welcome')//emits to single client when new client connects 
    socket.broadcast.emit('message', 'A new user has joined')//emits to all (except current) clients

    socket.on('sendMessage', (message) => {
        io.emit('message', message)  //emit to all clients
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
        
    })
})


server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
