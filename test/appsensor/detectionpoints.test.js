const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)
chai.use(require('chai-datetime'))
chai.use(require('chai-http'))
const frisby = require('frisby')
const app = require('../../server')
const appsensor = require('../../appsensor/api')
const request = chai.request

var mockRequire = require('mock-require')

const findMaliciousHeader = require('../../appsensor/detectionpoints.js').findMaliciousHeader
const buildJsonIpAddress = require('../../appsensor/detectionpoints.js').buildJsonIpAddress
const buildJsonUser = require('../../appsensor/detectionpoints.js').buildJsonUser
const buildAppSensorJsonEvent = require('../../appsensor/detectionpoints.js').buildAppSensorJsonEvent
const appSensorIE1middleware = require('../../appsensor/detectionpoints.js').appSensorIE1middleware

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
      expect(foundMaliciousHeader).to.deep.equal(actualMaliciousHeader)
      // Remove the XSS value from the array, because we've now verified that we can find it
      commonXssValues.shift()
    }
  })

  it('findMaliciousHeader search for malicious payload in header is case-insensitive', async () => {
    expect(true).to.equal(false) // TODO: Implement feature & test
  })

  it('buildJsonIpAddress should not contain GEO location data if the ip is localhost', async () => {
    const fnGetIpGeoDataFake = sinon.fake.returns('127.0.0.1')
    const jsonIpAddress = buildJsonIpAddress({}, fnGetIpGeoDataFake)
    expect(jsonIpAddress).to.deep.equal({ address: '127.0.0.1' })
  })

  it('buildJsonIpAddress should get the GEO location data from a expressjs request object if not localhost ip', async () => {
    const fakeRequestObject = {
      ipInfo: {
        ll: [1.429, -43.63234]
      }
    }
    const fnGetClientIpAddressFake = sinon.fake.returns('185.101.43.228')
    const jsonIpAddress = buildJsonIpAddress(fakeRequestObject, fnGetClientIpAddressFake)
    expect(fnGetClientIpAddressFake.called).to.be.equal(true)
    expect(jsonIpAddress).to.deep.equal(
      {
        address: '185.101.43.228',
        geoLocation: {
          latitude: 1.429,
          longitude: -43.63234
        }
      })
  })

  it('buildJsonUser should build the JsonUser object properly', async () => {
    const fnGetClientIpAddressFake = sinon.fake.returns('127.0.0.1')
    const jsonUser = buildJsonUser({}, fnGetClientIpAddressFake)
    expect(fnGetClientIpAddressFake.called).to.be.equal(true)
    expect(jsonUser.username).to.equal('Guest')
  })

  it('buildAppSensorJsonEvent should build the JsonEvent object properly', async () => {
    const detectionSystem = {
      detectionSystemId: 'myclientapp'
    }

    const detectionPoint_IE1 = {
      category: 'Input Validation',
      label: 'IE1',
      responses: []
    }

    const user = {
      username: 'Guest',
      ipAddress: { address: '127.0.0.1' }
    }

    const jsonEvent = buildAppSensorJsonEvent(detectionPoint_IE1, detectionSystem, user)
    expect(jsonEvent.detectionPoint).to.deep.equal(detectionPoint_IE1)
    expect(jsonEvent.detectionSystem).to.deep.equal(detectionSystem)
    expect(jsonEvent.user).to.deep.equal(user)
    expect(new Date(jsonEvent.timestamp)).to.equalDate(new Date())
  })

  it('appSensorIE1middleware detects malicious XSS payloads in headers and sends event to AppSensor', async (done) => {
    const appsensorReporter = new appsensor.RestReportingEngineApi()
    const initialEventCountPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const initialEventCount = initialEventCountPromise.response.body

    await request(app.server)
      .get('/runtime.js')
      .set('x-forwarded-for', '127.0.0.1')
      .set('SOME_MALICIOUS_HEADER', '<IMG SRC=javascript:alert(&quot;XSS&quot;)">')
      .send()

    const eventCountAfterMaliciousRequestPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const eventCountAfterMaliciousRequest = eventCountAfterMaliciousRequestPromise.response.body

    expect(eventCountAfterMaliciousRequest).to.equal(initialEventCount + 1)
    done()
  })
})
