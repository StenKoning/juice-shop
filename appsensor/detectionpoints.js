const appsensor = require('../appsensor/api')
const appSensorRequestHandler = new appsensor.RestRequestHandlerApi()
const _ = require('lodash')
const utils = require('../lib/utils')

module.exports = {
  appSensorIE1middleware: function appSensorIE1middleware (req, res, next) {
    var commonXssValues = [
      '<script>alert(document.cookie);</script>',
      '<script>alert();</script>',
      'alert(String.fromCharCode(88,83,83))',
      '<IMG SRC="javascript:alert(\'XSS\');">',
      '<IMG SRC=javascript:alert(\'XSS\')>',
      '<IMG SRC=javascript:alert(&quot;XSS&quot;)">',
      '<BODY ONLOAD=alert(\'XSS\')>'
    ]

    // Request headers check
    var maliciousHeader = module.exports.findMaliciousHeader(req.headers, commonXssValues)
    if (maliciousHeader === undefined) {
      next()
    }

    console.log('Found malicious header', maliciousHeader)
    var jsonEvent = module.exports.buildAppSensorJsonEvent(req)

    appSensorRequestHandler
      .resourceRestRequestHandlerAddEventPOST(
        jsonEvent,
        {
          headers: {
            'X-Appsensor-Client-Application-Name2': 'myclientapp'
          }
        })
      .then(function (incomingMessage) {
        console.log('Sent event to AppSensor!')
      })
      .catch(function (rejection) {
        next()
      })
    next()
  },
  /**
   * Returns a header name and values, who's value contains a value from the maliciousValues array
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
    if (maliciousHeaderName === undefined) {
      return undefined
    }

    return {
      name: maliciousHeaderName,
      value: headersObj[maliciousHeaderName]
    }
  },

  buildAppSensorJsonEvent: function buildAppSensorJsonEvent (req) {
    const detectionPoint = {
      category: 'Input Validation',
      label: 'IE1',
      responses: []
    }

    var detectionSystem = {
      detectionSystemId: 'myclientapp'
    }

    var user = {
      username: 'Guest',
      ipAddress: module.exports.buildJsonIpAddress(req, utils.getIpAddress)
    }

    var jsonEvent = {
      detectionPoint: detectionPoint,
      detectionSystem: detectionSystem,
      user: user,
      timestamp: new Date().toISOString()
    }

    return jsonEvent
  },

  buildJsonIpAddress: function buildJsonIpAddress (req, fnGetIpGeoData) {
    var ipaddress = {
      address: fnGetIpGeoData(req)
    }

    if (utils.getIpAddress(req) !== '127.0.0.1') {
      ipaddress.geoLocation = new appsensor.JsonGeolocation()
      ipaddress.geoLocation.latitude = req.ipInfo.ll[0]
      ipaddress.geoLocation.longitude = req.ipInfo.ll[1]
    }

    return ipaddress
  }
}
