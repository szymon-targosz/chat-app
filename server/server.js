const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3002;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });


    socket.on('createMessage', message => {
        console.log('created message', message);
        
        io.emit('newMessage', {
            ...message,
            createdAt: new Date().getTime()
        });
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});