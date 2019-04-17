var describe = require('selenium-webdriver/testing').describe
var findMaliciousHeader = require('../../appsensor/detectionpoints.js').findMaliciousHeader

describe('Detection Point IE1', () => {
  it('findMaliciousHeader should find the first malicious header', async () => {
    const commonXssValues = [
      '<script>alert(document.cookie);</script>',
      '<script>alert();</script>',
      'alert(String.fromCharCode(88,83,83))',
      '<IMG SRC="javascript:alert(\'XSS\');">',
      '<IMG SRC=javascript:alert(\'XSS\')>',
      '<IMG SRC=javascript:alert(&quot;XSS&quot;)">',
      '<BODY ONLOAD=alert(\'XSS\')>'
    ]

    const headers = {
      'Access-Control-Allow-Credentials': '<script>alert(document.cookie);</script>',
      'Access-Control-Allow-Headers': '<script>alert();</script>',
      'Access-Control-Allow-Methods': 'alert(String.fromCharCode(88,83,83))',
      'Access-Control-Allow-Origin': '<IMG SRC="javascript:alert(\'XSS\');">',
      'Content-Security-Policy, X-Content-Security-Policy, X-WebKit-CSP': '<IMG SRC=javascript:alert(\'XSS\')>',
      'Content-Security-Policy-Report-Only': '<IMG SRC=javascript:alert(&quot;XSS&quot;)">',
      'WWW-Authenticate': '<BODY ONLOAD=alert(\'XSS\')>'
    }

    // For each common XSS payload value
    for (let i = 0; i < commonXssValues.length; i++) {
      const foundMaliciousHeader = findMaliciousHeader(headers, commonXssValues)
      const actualMaliciousHeader = {
        name: Object.keys(headers)[i],
        value: headers[Object.keys(headers)[i]]
      }
      expect(foundMaliciousHeader).toEqual(actualMaliciousHeader)
      // Remove the XSS value from the array, because we've now verified that we can find it
      commonXssValues.shift()
    }
  })

  it('Should detect common XSS attack values in headers', async () => {
    // Fake a request with malicious header

  })

  it('Should detect common XSS attack values in HTTP payloads', async () => {

  })

})