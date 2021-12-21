const SocketIO = require('socket.io')
const MapUtil = require('../_Api_Interface/Util/MapUtil')
const LiveCodeController = require('./Controller/liveCode')

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: 'socket.io' })
  app.set('io', io)
  const classRoom = io.of('/classRoom')

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next)
  })

  const roomMap = new MapUtil(String, Object)

  classRoom.on('connection', (socket) => {
    // 교실 입장
    const liveCode = new LiveCodeController()
    let roomId = null

    socket.on('start', (data) => {
      roomId = data.roomId
      roomMap.put(roomId, {
        liveCode,
      })
      liveCode.classStart(roomMap, data)
    })

    socket.on('close class', () => {
      roomMap.remove(roomId)
    })

    socket.on('update code', (data) => {
      liveCode.updateCode(data)
    })

    socket.on('close', () => {})

    socket.on('get online class', () => {})

    socket.on('get online student', () => {})
  })
}
