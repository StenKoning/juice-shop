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
        .then(function () {
          return res.send(405)
        })
        .catch(function (rejection) {
          console.log('Error sending Event to AppSensor', rejection)
          res.send(502)
        })
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