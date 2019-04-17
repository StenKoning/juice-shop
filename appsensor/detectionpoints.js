const appsensor = require('../appsensor/api')
const appSensorRequestHandler = new appsensor.RestRequestHandlerApi()
const _ = require('lodash')
const utils = require('../lib/utils')

module.exports = {
  detectionSystem: {
    detectionSystemId: 'myclientapp'
  },

  detectionPoint_IE1: {
    category: 'Input Validation',
    label: 'IE1',
    responses: []
  },

  appSensorRequestOptions: {
    headers: {
      'X-Appsensor-Client-Application-Name2': 'myclientapp'
    }
  },

  commonXssPayloads: [
    '<script>alert(document.cookie);</script>',
    '<script>alert();</script>',
    'alert(String.fromCharCode(88,83,83))',
    '<IMG SRC="javascript:alert(\'XSS\');">',
    '<IMG SRC=javascript:alert(\'XSS\')>',
    '<IMG SRC=javascript:alert(&quot;XSS&quot;)">',
    '<BODY ONLOAD=alert(\'XSS\')>'
  ],

  appSensorIE1middleware: function appSensorIE1middleware (req, res, next) {
    // If there's no malicious header, continue to next middleware
    if (!module.exports.findMaliciousHeader(req.headers, module.exports.commonXssPayloads)) {
      next()
    }

    var jsonEvent = module.exports.buildAppSensorJsonEvent(
      module.exports.detectionPoint_IE1,
      module.exports.detectionSystem,
      module.exports.buildJsonUser(req, utils.getIpAddress)
    )

    appSensorRequestHandler
      .resourceRestRequestHandlerAddEventPOST(jsonEvent, module.exports.appSensorRequestOptions)
      .then(function (incomingMessage) {
        console.log('Sent event to AppSensor!')
      })
      .catch(function (rejection) {
        // NOP
      })
    next()
  },

  /**
   * Returns a header name and value, who's value contains a value from the maliciousValues array
   * @param headersObj object
   * @param maliciousValuesArr array
   * @returns  {object}||undefined
   */
  findMaliciousHeader: function findMaliciousHeader (headersObj, maliciousValuesArr) {
    var maliciousHeaderName = _.findKey(headersObj, function (headerValue, headerName) {
      var headerContainsXss = false
      maliciousValuesArr.forEach(function (commonXssValue) {
        if (headerValue.indexOf(commonXssValue) !== -1) {
          return (headerContainsXss = true)
        }
      })

      return headerContainsXss
    })
    if (!maliciousHeaderName) {
      return undefined
    }

    return {
      name: maliciousHeaderName,
      value: headersObj[maliciousHeaderName]
    }
  },

  buildJsonUser: function buildJsonUser (req, fnGetClientIpAddress) {
    return {
      username: 'Guest',
      ipAddress: module.exports.buildJsonIpAddress(req, fnGetClientIpAddress)
    }
  },

  buildJsonIpAddress: function buildJsonIpAddress (req, fnGetClientIpAddress) {
    const ipaddress = {
      address: fnGetClientIpAddress(req)
    }

    if (ipaddress.address !== '127.0.0.1') {
      ipaddress.geoLocation = new appsensor.JsonGeolocation()
      ipaddress.geoLocation.latitude = req.ipInfo.ll[0]
      ipaddress.geoLocation.longitude = req.ipInfo.ll[1]
    }

    return ipaddress
  },

  buildAppSensorJsonEvent: function buildAppSensorJsonEvent (detectionPoint, detectionSystem, user) {
    return {
      detectionPoint: detectionPoint,
      detectionSystem: detectionSystem,
      user: user,
      timestamp: new Date().toISOString()
    }
  }
}
