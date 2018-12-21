const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {

    socket.on('join', ({ name, room }, callback) => {
        if (!isRealString(name) || !isRealString(room)) {
            return callback('Name and room are required');
        }

        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room);

        io.to(room).emit('updateUsersList', users.getUsersList(room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} has joined.`));

        callback();
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });

    socket.on('createMessage', (message, callback) => {
        console.log('create message', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', ({ latitude, longitude }) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', latitude, longitude));
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});