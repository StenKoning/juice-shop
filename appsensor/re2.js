const clientCore = require('./clientCore')
const _ = require('lodash')
const utils = require('../lib/utils')

module.exports = {
  middleware: {
    attemptToInvokeUnsupportedHttpMethod: function (req, res, next) {
      const allowedMethods = ['HEAD', 'GET', 'POST', 'PUT', 'DELETE', 'TRACE', 'OPTIONS', 'CONNECT']
      if (allowedMethods.includes(req.method.toUpperCase())) {
        next()
      }

      // report RE2 to AppSensor (Attempt To Invoke Unsupported Http Method)
      clientCore
        .postEventToAppSensor(module.exports.buildAppSensorRE2JsonEvent(req))
        .catch(function (rejection) {
          console.log('Error sending Event to AppSensor', rejection)
        })

      return res.status(405).end()
    }
  },

  buildAppSensorRE2JsonEvent: function (req) {
    return clientCore.buildAppSensorJsonEvent(
      clientCore.detectionPoint_RE2,
      clientCore.detectionSystem,
      clientCore.buildJsonUser(req, utils.getIpAddress)
    )
  }
}