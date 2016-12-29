import io from 'socket.io-client';
import { expect } from 'chai';
import server from '../server/socket-server';

const options = {
  transports: ['websocket'],
  'force new connection': true
};
const port = process.env.PORT || 3000;

beforeEach((done) => {
  // start the server
  server.listen(port, () => {
    console.log('Socket server listening on ' + port);
    done();
  });
});

afterEach((done) => {
  // stop the server
  server.close(() => {
    console.log('Socket server closed');
    done();
  });
});

describe("Socket server", function () {
  it("Join Room", function (done) {
    var client = io.connect('http://localhost:' + port, options);

    client.on('connect', () => {
      client.once('roomJoined', (roomName, userName) => {
        expect(roomName).to.equal('r1');
        expect(userName).to.equal('u1');
        client.disconnect();
        done();
      });

      client.emit('joinRoom', 'r1', 'u1');
    });
  });
});
