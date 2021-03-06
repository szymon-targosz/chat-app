const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const { Rooms } = require('./utils/rooms');

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();
const rooms = new Rooms();

app.use(express.static(publicPath));

io.on('connection', socket => {
    socket.emit('rooms', rooms.getRooms());

    socket.on('join', ({ name, room }, callback) => {
        room = room.trim().toLowerCase();
        name = name.trim().toLowerCase();

        if (!isRealString(name) || !isRealString(room)) {
            return callback('Name and room are required.');
        }

        if (users.getUsersList(room).includes(name)) {
            return callback(`Name is already taken.`);
        }

        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room);

        if (!rooms.getRooms().includes(room)) {
            rooms.addRoom(room);
        }

        io.to(room).emit('updateUsersList', users.getUsersList(room));

        socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${room} room`));

        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} has joined.`));

        callback();
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

            const availableRooms = Object.keys(io.sockets.adapter.rooms);
            if (!availableRooms.includes(user.room)) {
                rooms.removeRoom(user.room);
            }
        }
    });

    socket.on('createMessage', ({ text }, callback) => {
        const user = users.getUser(socket.id);
        if (user && isRealString(text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, text));
        }
        callback();
    });

    socket.on('createLocationMessage', ({ latitude, longitude }) => {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, latitude, longitude));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});