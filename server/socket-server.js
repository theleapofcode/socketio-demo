import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import redis from 'socket.io-redis';
import chalk from 'chalk';

const app = express();
const server = http.Server(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

io.adapter(redis({ host: redisHost, port: redisPort }));

server.listen(port, () => console.log(chalk.blue('Socket server listening on ' + port)));

const ROOM_PREFIX = 'ROOM_';
const USER_PREFIX = 'USER_';

io.sockets.on('connection', (socket) => {
  console.log(chalk.green('New socket connection - ' + socket.id));
  socket.on('joinRoom', function (roomName, userName) {
    console.log(userName + ' joining ' + roomName);
    socket.userName = userName;
    socket.join(ROOM_PREFIX + roomName); // Join room identified by roomName
    socket.join(USER_PREFIX + userName); // Join room identified by userName
    socket.emit('roomJoined', roomName, userName);
  });

  socket.on('leaveRoom', (roomName, userName) => {
    console.log(chalk.green(userName + ' leaving ' + roomName));
    socket.emit('roomLeft', roomName, userName);
    socket.leave(ROOM_PREFIX + roomName);
    socket.leave(USER_PREFIX + userName);
  });

  socket.on('broadcastToAllUsers', (message) => {
    console.log(chalk.green(socket.userName + ' broadcasting to all users with message -  ' + message));
    io.emit('broadcastMessage', socket.userName, message);
  });

  socket.on('broadcastToRoom', (roomName, message) => {
    console.log(chalk.green(socket.userName + ' broadcasting to room  -  ' + roomName + ' with message - ' + message));
    if (io.sockets.adapter.rooms[ROOM_PREFIX + roomName]) {
      socket.broadcast.to(ROOM_PREFIX + roomName).emit('roomBroadcastMessage', socket.userName, message);
    }
  });

  socket.on('unicastToUser', (userName, message) => {
    console.log(chalk.green(socket.userName + ' unicasting to username  -  ' + userName + ' with message - ' + message));
    if (userName && io.sockets.in(USER_PREFIX + userName)) {
      io.sockets.in(USER_PREFIX + userName).emit('unicastMessage', socket.userName, message);
    }
  });

  socket.on('multicastToUsers', (userNames, message) => {
    console.log(chalk.green(socket.userName + ' multicasting to usernames  -  ' + JSON.stringify(userNames) + ' with message - ' + message));
    for (var userName of userNames) {
      if (userName && io.sockets.in(USER_PREFIX + userName)) {
        io.sockets.in(USER_PREFIX + userName).emit('multicastMessage', socket.userName, message);
      }
    }
  });

});
