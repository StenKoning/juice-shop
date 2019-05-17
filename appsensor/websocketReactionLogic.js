const insecurity = require('../lib/insecurity')
const User = require('../models/user')
const WebSocket = require('ws')

module.exports = {
  openConn: async function () {
    const wsConn =  new WebSocket(
      process.env.APPSENSOR_WEB_SOCKET_HOST_URL
    )

    wsConn.onerror = function (event) {
      if (event.error.errno === 'ECONNREFUSED') {
        console.log(`Couldn\'t connect to AppSensor WebSocket API
         on ${process.env.APPSENSOR_WEB_SOCKET_HOST_URL}, automated response disabled`)
      }
    }

    return wsConn
  },

  initEventListeners: function (wsConn) {
    wsConn.onopen = module.exports.onOpen
    wsConn.onmessage = module.exports.onMessage
  },

  onOpen: function (event) {
    console.log('WebSocket connection opened')
  },

  onMessage: function (message) {
    const parsedEvent = JSON.parse(message.data)
    console.log('WS MSG FROM SERVER: ', parsedEvent)

    const eventName = parsedEvent.dataType
    const eventMethodExists = Object.keys(module.exports.eventMethods).includes(eventName)
    if (!eventMethodExists) {
      return 1
    }

    module.exports.eventMethods[eventName](parsedEvent)
  },

  eventMethods: {
    response: function (event) {
      const cmds = module.exports.commands
      if (Object.keys(cmds).includes(event.dataValue.action)) {
        cmds[event.dataValue.action](event.dataValue.user, event.dataValue.interval)
      }
    }
  },

  commands: {
    logout: function (user, interval) {
      User.find({ where: { email: user.username } })
        .then(user => {
          insecurity.remove(user)
        })
    }
  }
}