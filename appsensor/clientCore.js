const _ = require('lodash')
const appsensor = require('../appsensor/api')

module.exports = {
  detectionSystem: {
    detectionSystemId: 'myclientapp'
  },

  detectionPoint_IE1: {
    category: 'Input Validation',
    label: 'IE1',
    responses: []
  },

  detectionPoint_RE1: {
    category: 'Unexpected HTTP Command',
    label: 'RE1',
    responses: []
  },

  detectionPoint_RE2: {
    category: 'Attempt To Invoke Unsupported HTTP Method',
    label: 'RE2',
    responses: []
  },

  detectionPoint_RE3: {
    category: 'GET When Expecting POST',
    label: 'RE3',
    responses: []
  },

  detectionPoint_RE4: {
    category: 'POST When Expecting GET',
    label: 'RE4',
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

  /**
   * Returns a header name and value, who's value contains a value from the given array
   * @param headersObj object
   * @param maliciousValuesArr array
   * @returns  {object}||undefined
   */
  findFirstHeaderThatContainsValueFromArray: function (headersObj, maliciousValuesArr) {
    const matchingHeaderName = _.findKey(headersObj, function (headerValue, headerName) {
      let headerContainsOneOfTheValues = false
      maliciousValuesArr.forEach(function (commonXssValue) {
        if (headerValue.indexOf(commonXssValue) !== -1) {
          return (headerContainsOneOfTheValues = true)
        }
      })

      return headerContainsOneOfTheValues
    })
    if (!matchingHeaderName) {
      return undefined
    }

    return {
      name: matchingHeaderName,
      value: headersObj[matchingHeaderName]
    }
  },

  payloadContainsMaliciousString: function (requestBody, maliciousValuesArr) {
    let containsMaliciousString = false
    const requestBodyAsStr = typeof requestBody === 'string' ? requestBody : Object.values(requestBody).join()
    maliciousValuesArr.forEach(function (commonXssValue) {
      if (requestBodyAsStr.indexOf(commonXssValue) !== -1) {
        containsMaliciousString = true
      }
    })
    return containsMaliciousString
  },

  postEventToAppSensor: function (jsonEvent) {
    return new appsensor.RestRequestHandlerApi()
      .resourceRestRequestHandlerAddEventPOST(
        jsonEvent,
        module.exports.appSensorRequestOptions
      )
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

    if (ipaddress.address !== '127.0.0.1' && req.ipInfo.ll) {
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
