const insecurity = require('../lib/insecurity')
const models = require('../models')
const WebSocket = require('ws')

module.exports = {
  setupConnection: async function () {
    const wsConn = new WebSocket(process.env.APPSENSOR_WEB_SOCKET_HOST_URL)
    module.exports.initEventListeners(wsConn)
    return wsConn
  },

  initEventListeners: function (wsConn) {
    wsConn.onopen = module.exports.onOpen
    wsConn.onmessage = module.exports.onMessage
    wsConn.onerror = module.exports.onError
  },

  onOpen: function (event) {
    console.log(`WebSocket connection opened @ ${process.env.APPSENSOR_WEB_SOCKET_HOST_URL}, AppSensor automated response enabled`)
  },

  onMessage: function (message) {
    const parsedEvent = JSON.parse(message.data)
    //console.log('WS MSG FROM SERVER: ', parsedEvent)

    const eventName = parsedEvent.dataType
    const eventMethodExists = Object.keys(module.exports.eventMethods).includes(eventName)
    if (!eventMethodExists) {
      return 1
    }

    module.exports.eventMethods[eventName](parsedEvent)
  },

  onError: function (event) {
    if (event.error.errno === 'ECONNREFUSED') {
      console.log(`Couldn't connect to AppSensor WebSocket API on ${process.env.APPSENSOR_WEB_SOCKET_HOST_URL}, automated response disabled`)
    }
  },

  eventMethods: {
    response: function (event) {
      const cmds = module.exports.commands
      if (Object.keys(cmds).includes(event.dataValue.action)) {
        console.log(`AppSensor response received: ${event.dataValue.action} for user: ${event.dataValue.user.username}`)
        cmds[event.dataValue.action](event.dataValue.user, event.dataValue.interval)
      }
    }
  },

  commands: {
    logout: function (user, interval) {
      console.log('logout function reached')
      models.User
        .findOne({ where: { email: user.username } })
        .then(user => {
          insecurity.authenticatedUsers.remove(user)
          console.log(`AppSensor logged out user ${user.username}`)
        })
        .catch(function (err) {
          console.log(err)
        })
    }
  }
}