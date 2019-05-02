const clientCore = require('./clientCore')
const _ = require('lodash')
const utils = require('../lib/utils')

module.exports = {
  middleware: {
    receivingPostWhenExpectingGet: function (req, res, next) {
      if (req.method !== 'POST') {
        return next()
      }

      const routeKeyThatMatchesRequirements = _.findKey(req.allRoutes, function (route) {
        const allowedMethods = Object.keys(route.methods)

        if (route.path === req.url && allowedMethods.length === 1) {
          if (allowedMethods.includes('get')) {
            return true
          }
        }
        return false
      })

      if (!routeKeyThatMatchesRequirements) {
        return next()
      }

      clientCore
        .postEventToAppSensor(module.exports.buildAppSensorRE4JsonEvent(req))
        .then(function () {
          return res.status(405).end()
        })
        .catch(function (rejection) {
          console.log('Error sending Event to AppSensor', rejection)
          res.status(502).end()
        })
    }
  },

  buildAppSensorRE4JsonEvent: function (req) {
    return clientCore.buildAppSensorJsonEvent(
      clientCore.detectionPoint_RE4,
      clientCore.detectionSystem,
      clientCore.buildJsonUser(req, utils.getIpAddress)
    )
  }
}