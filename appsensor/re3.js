const clientCore = require('./clientCore')
const _ = require('lodash')
const utils = require('../lib/utils')

module.exports = {
  middleware: {
    receivingGetWhenExpectingPost: function (req, res, next) {
      if (req.method !== 'GET') {
        return next()
      }

      const routeKeyThatMatchesRequirements = _.findKey(req.allRoutes, function (route) {
        const allowedMethods = Object.keys(route.methods)

        if (route.path === req.url && allowedMethods.length === 1) {
          if (allowedMethods.includes('post')) {
            return true
          }
        }
        return false
      })

      if (!routeKeyThatMatchesRequirements) {
        return next()
      }

      clientCore
        .postEventToAppSensor(module.exports.buildAppSensorRE3JsonEvent(req))
        .catch(function (rejection) {
          console.log('Error sending Event to AppSensor', rejection)
        })
      return res.status(405).end()
    }
  },

  buildAppSensorRE3JsonEvent: function (req) {
    return clientCore.buildAppSensorJsonEvent(
      clientCore.detectionPoint_RE3,
      clientCore.detectionSystem,
      clientCore.buildJsonUser(req, utils.getIpAddress)
    )
  }
}