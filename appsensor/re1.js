const clientCore = require('./clientCore')
const _ = require('lodash')
const utils = require('../lib/utils')

module.exports = {
  middleware: {
    unexpectedHttpMethodIsUsed: function (req, res, next) {
      const routeKeyThatMatchesCurrentPath = _.findKey(req.allRoutes, function (route) {
        return route.path === req.url
      })

      if (!routeKeyThatMatchesCurrentPath) {
        return next()
      }

      const routeThatMatchesCurrentPath = req.allRoutes[routeKeyThatMatchesCurrentPath]

      const allowedMethods = Object.keys(routeThatMatchesCurrentPath.methods)
      const unexpectedHttpMethodIsUsed = !allowedMethods.includes(req.method.toLowerCase())
      if (unexpectedHttpMethodIsUsed) {
        // report RE1 to AppSensor (Unexpected HTTP Method)

        clientCore
          .postEventToAppSensor(module.exports.buildAppSensorRE1JsonEvent(req))
          .then(function () {
            return res.send(405)
          })
          .catch(function (rejection) {
            console.log('Error sending Event to AppSensor', rejection)
            res.send(502)
          })
      }
    }
  },

  buildAppSensorRE1JsonEvent: function (req) {
    return clientCore.buildAppSensorJsonEvent(
      clientCore.detectionPoint_RE1,
      clientCore.detectionSystem,
      clientCore.buildJsonUser(req, utils.getIpAddress)
    )
  }
}