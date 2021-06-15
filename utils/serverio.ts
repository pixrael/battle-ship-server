const socketio = require('socket.io')

function initSocket(server, origin) {
  const io = socketio(server, {
    cors: {
      origin, //TODO: depends on the environment
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('connected ')

    socket.on('joinRoom', ({ username, room }) => {
      console.log('joinRoom socket ', username, room)
    })
  })
}

module.exports = {
  initSocket,
}
