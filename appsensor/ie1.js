const clientCore = require('./clientCore')
const utils = require('../lib/utils')
const _ = require('lodash')
const Promise = require('bluebird')

module.exports = {
  middleware: {
    checkHeadersForXssPayload: function dpmCheckHeadersForXssPayload (req, res, next) {
      if (!module.exports.requestContainsMaliciousHeaders(req)) {
        return next()
      }

      clientCore.postEventToAppSensor(module.exports.buildAppSensorIE1JsonEvent(req))
        .then(function (result) {
          return res.status(400).end()
        })
        .catch(function (rejection) {
          console.log('Error sending Event to AppSensor', rejection)
          return res.status(502).end()
        })
    },

    checkBodyForXssPayload: function dpmCheckBodyForXssPayload (req, res, next) {
      if (_.isEmpty(req.body) || !clientCore.payloadContainsMaliciousString(req.body, clientCore.commonXssPayloads)) {
        return next()
      }

      clientCore.postEventToAppSensor(module.exports.buildAppSensorIE1JsonEvent(req))
        .then(function () {
          return res.status(400).end()
        })
        .catch(function (rejection) {
          console.log('Error sending Event to AppSensor', rejection)
          return res.status(502).end()
        })
    }
  },

  requestContainsMaliciousHeaders: function (req) {
    return Boolean(clientCore
      .findFirstHeaderThatContainsValueFromArray(
        req.headers,
        clientCore.commonXssPayloads
      ))
  },

  buildAppSensorIE1JsonEvent: function (req) {
    return clientCore.buildAppSensorJsonEvent(
      clientCore.detectionPoint_IE1,
      clientCore.detectionSystem,
      clientCore.buildJsonUser(req, utils.getIpAddress)
    )
  }
}
