# socketio-demo
Demo of [Socket.io](http://socket.io/)

## Features
  * Support for multi socket server nodes using [socket-io-redis](https://github.com/socketio/socket.io-redis)
  * Join and leave rooms using usernames
  * Broadcast messages to all users across multiple nodes
  * Broadcast messages to a particular room across multiple nodes
  * Unicast messages to a user across multiple nodes
  * Multicast messages to set of users across multiple nodes
  * Sample UI to playaround with the Features

## Steps to run the demo
  1. Clone the repo - `git clone https://github.com/theleapofcode/socketio-demo.git`
  2. NPM install - `npm i`
  3. Run redis server - `redis-server`
  4. Run the demo npm script - `npm run demo`

This starts two socket server nodes listening on 3000 and 3001 and also starts a webpack-dev-server serving the demo UI on 8080. Open http://localhost:8080 in two tabs. Connect to http://localhost:3000 in one tab and http://localhost:3001 on the second tab with different usernames. Play around with all the features.
