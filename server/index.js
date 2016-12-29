import server from './socket-server';

const port = process.env.PORT || 3000;
server.listen(port, () => console.log('Socket server listening on ' + port));
