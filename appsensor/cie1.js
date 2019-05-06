const clientCore = require('./clientCore')
const utils = require('../lib/utils')
const _ = require('lodash')
const Promise = require('bluebird')

module.exports = {
  middleware: {
    checkQueryParamtersForSqlInjection: function (req, res, next) {
      if (_.isEmpty(req.query)) {
        return next()
      }

      if (!clientCore.containsBlacklistedValue(req.query, clientCore.commonSqlInjectionPayloads)) {
        return next()
      }

      clientCore
        .postEventToAppSensor(module.exports.buildAppSensorCIE1JsonEvent(req))
        .catch(function (rejection) {
          console.log('Error sending Event to AppSensor', rejection)
        })

      return res.status(400).end()
    },

    checkHeadersForSqlInjection: function (req, res, next) {
      if (!clientCore.containsBlacklistedValue(req.headers, clientCore.commonSqlInjectionPayloads)) {
        return next()
      }

      clientCore.postEventToAppSensor(module.exports.buildAppSensorCIE1JsonEvent(req))
        .catch(function (rejection) {
          console.log('Error sending Event to AppSensor', rejection)
        })
      return res.status(400).end()
    }
  },

  buildAppSensorCIE1JsonEvent: function (req) {
    return clientCore.buildAppSensorJsonEvent(
      clientCore.detectionPoint_CIE1,
      clientCore.detectionSystem,
      clientCore.buildJsonUser(req, utils.getIpAddress)
    )
  }
}
