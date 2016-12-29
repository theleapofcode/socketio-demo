import './index.css';

import $ from 'jquery';
import io from 'socket.io-client';

class SocketClient {
  constructor(username, callbacks) {
    this.socket = null;
    this.username = username;

    this.emptyFunction = function () { };

    if (!callbacks) {
      callbacks = {};
    }

    this.connectCallback = callbacks.connectCallback || this.emptyFunction;
    this.disconnectCallback = callbacks.disconnectCallback || this.emptyFunction;
    this.errorCallback = callbacks.errorCallback || this.emptyFunction;
    this.roomJoinedCallback = callbacks.roomJoinedCallback || this.emptyFunction;
    this.roomLeftCallback = callbacks.roomLeftCallback || this.emptyFunction;
    this.broadcastMessageCallback = callbacks.broadcastMessageCallback || this.emptyFunction;
    this.roomBroadcastMessageCallback = callbacks.roomBroadcastMessageCallback || this.emptyFunction;
    this.unicastMessageCallback = callbacks.unicastMessageCallback || this.emptyFunction;
    this.multicastMessageCallback = callbacks.multicastMessageCallback || this.emptyFunction;
  }

  connectToServer(url) {
    this.socket = io(url);

    var that = this;

    this.socket.on('connect', function () {
      that.connectCallback();
    });

    this.socket.on('disconnect', function () {
      that.disconnectCallback();
    });

    this.socket.on('error', function (error) {
      that.errorCallback(error);
    });

    this.socket.on('roomJoined', function (roomName, userName) {
      that.roomJoinedCallback(roomName, userName);
    });

    this.socket.on('roomLeft', function (roomName, userName) {
      that.roomLeftCallback(roomName, userName);
    });

    this.socket.on('broadcastMessage', function (from, message) {
      that.broadcastMessageCallback(from, message);
    });

    this.socket.on('roomBroadcastMessage', function (from, message) {
      that.roomBroadcastMessageCallback(from, message);
    });

    this.socket.on('unicastMessage', function (from, message) {
      that.unicastMessageCallback(from, message);
    });

    this.socket.on('multicastMessage', function (from, message) {
      that.multicastMessageCallback(from, message);
    });
  }

  joinRoom(roomname) {
    this.socket.emit('joinRoom', roomname, this.username);
  }

  leaveRoom(roomname) {
    this.socket.emit('leaveRoom', roomname, this.username);
  }

  broadcastToAllUsers(message) {
    this.socket.emit('broadcastToAllUsers', message);
  }

  broadcastToRoom(roomname, message) {
    this.socket.emit('broadcastToRoom', roomname, message);
  }

  unicastToUser(username, message) {
    this.socket.emit('unicastToUser', username, message);
  }

  multicastToUsers(usernames, message) {
    this.socket.emit('multicastToUsers', usernames, message);
  }
}

let client = null;

let connectCallback = () => {
  console.log("Connected to server");
  $("#statusMsg").text("Connected to server");
};

let disconnectCallback = () => {
  console.log("Disconnected from server");
  $("#statusMsg").text("Disconnected from server");
};

let errorCallback = (error) => {
  console.log("Error connecting to server");
  console.log(JSON.stringify(error));
  $("#statusMsg").text("Error connecting to server");
};

let roomJoinedCallback = (roomName, userName) => {
  console.log(userName + " joined " + roomName);
  $("#statusMsg").text(userName + " joined " + roomName);
};

let roomLeftCallback = (roomName, userName) => {
  console.log(userName + " left " + roomName);
  $("#statusMsg").text(userName + " left " + roomName);
};

let broadcastMessageCallback = (from, message) => {
  console.log("Broadcast message recieved : From - " + from + " Message - " + message);
  $("#statusMsg").text("Broadcast message recieved : From - " + from + " Message - " + message);
};

let roomBroadcastMessageCallback = (from, message) => {
  console.log("Room broadcast message recieved : From - " + from + " Message - " + message);
  $("#statusMsg").text("Room broadcast message recieved : From - " + from + " Message - " + message);
};

let unicastMessageCallback = (from, message) => {
  console.log("Unicast message recieved : From - " + from + " Message - " + message);
  $("#statusMsg").text("Unicast message recieved : From - " + from + " Message - " + message);
};

let multicastMessageCallback = (from, message) => {
  console.log("Multicast message recieved : From - " + from + " Message - " + message);
  $("#statusMsg").text("Multicast message recieved : From - " + from + " Message - " + message);
};

let callbacks = {
  connectCallback: connectCallback,
  disconnectCallback: disconnectCallback,
  errorCallback: errorCallback,
  roomJoinedCallback: roomJoinedCallback,
  roomLeftCallback: roomLeftCallback,
  broadcastMessageCallback: broadcastMessageCallback,
  roomBroadcastMessageCallback: roomBroadcastMessageCallback,
  unicastMessageCallback: unicastMessageCallback,
  multicastMessageCallback: multicastMessageCallback
};

$(document).ready(function () {
});

$("#connectBtn").click(function () {
  var userName = $("#userName").val();
  var url = $("#url").val();
  client = new SocketClient(userName, callbacks);
  client.connectToServer(url);
});

$("#joinRoomBtn").click(function () {
  var roomName = $("#roomName").val();
  client.joinRoom(roomName);
});

$("#leaveRoomBtn").click(function () {
  var roomName = $("#roomName").val();
  client.leaveRoom(roomName);
});

$("#broadcastToAllUsersBtn").click(function () {
  var message = $("#broadcastToAllUsersMessage").val();
  client.broadcastToAllUsers(message);
});

$("#broadcastToRoomBtn").click(function () {
  var roomName = $("#roomName").val();
  var message = $("#broadcastToRoomMessage").val();
  client.broadcastToRoom(roomName, message);
});

$("#unicastToUserBtn").click(function () {
  var toUserName = $("#unicastToUserUserName").val();
  var message = $("#unicastToUserMessage").val();
  client.unicastToUser(toUserName, message);
});

$("#multicastToUsersBtn").click(function () {
  var toUserNamesString = $("#multicastToUsersUserNames").val();
  var message = $("#multicastToUsersMessage").val();

  var toUserNames = toUserNamesString.split(",");
  client.multicastToUsers(toUserNames, message);
});
