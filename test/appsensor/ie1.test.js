const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)
chai.use(require('chai-datetime'))
chai.use(require('chai-http'))
chai.use(require('chai-as-promised'))
const request = chai.request
const mockReq = require('sinon-express-mock').mockReq
const mockRes = require('sinon-express-mock').mockRes
const appsensor = require('../../appsensor/api')
const server = require('../../server')
const checkHeadersForXssPayload = require('../../appsensor/ie1').middleware.checkHeadersForXssPayload
const clientCore = require('../../appsensor/clientCore')

/*describe('checkHeadersForXssPayload', () => {
  it('should detect blacklisted XSS payloads in headers and send event to AppSensor', async (done) => {
    const appsensorReporter = new appsensor.RestReportingEngineApi()
    const initialEventCountPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const initialEventCount = initialEventCountPromise.response.body

    await request(server.server)
      .get('/runtime.js')
      .set('x-forwarded-for', '127.0.0.1')
      .set('SOME_MALICIOUS_HEADER', '<IMG SRC=javascript:alert(&quot;XSS&quot;)">')
      .send()
      .then(function (res) {
        expect(res).to.have.status(400)
      })

    const eventCountAfterMaliciousRequestPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const eventCountAfterMaliciousRequest = eventCountAfterMaliciousRequestPromise.response.body

    expect(eventCountAfterMaliciousRequest).to.equal(initialEventCount + 1)
    done()
  })

  it('should go next() if no blacklisted payloads are found', async (done) => {
    const appsensorReporter = new appsensor.RestReportingEngineApi()
    const initialEventCountPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const initialEventCount = initialEventCountPromise.response.body

    await request(server.server)
      .get('/runtime.js')
      .set('x-forwarded-for', '127.0.0.1')
      .set('SOME_NON_MALICIOUS_HEADER', 'some non malicious value')
      .send()
      .then(function (res) {
        expect(res).to.have.status(200)
      })

    const eventCountAfterRequestPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const eventCountAfterRequest = eventCountAfterRequestPromise.response.body

    expect(eventCountAfterRequest).to.equal(initialEventCount)
    done()
  })
})

describe('checkBodyForXssPayload', () => {
  it('should detect blacklisted XSS payloads in HTTP payload and send event to AppSensor on at least POST, PATCH, PUT', async (done) => {
    const appsensorReporter = new appsensor.RestReportingEngineApi()
    const initialEventCountPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const initialEventCount = initialEventCountPromise.response.body

    await request(server.server)
      .post('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .send(
        {
          'data_with_malicious_value': '<br>Here it comes: <script>alert(document.cookie);</script></br>'
        }
      )
      .then(function (res) {
        expect(res).to.have.status(400)
      })

    const eventCountAfterRequestPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const eventCountAfterRequest = eventCountAfterRequestPromise.response.body

    expect(eventCountAfterRequest).to.equal(initialEventCount + 1)
    done()
  })

  xit('should be case-insensitive when looking for XSS values', () => {
    expect(true).to.be.false()
  })
})*/

let fakeAddAppSensorEventFn

describe('checkHeadersForXssPayload', () => {
  beforeEach(() => {
    fakeAddAppSensorEventFn = sinon.fake.returns(Promise.resolve({ a: 1 }))
    appsensor
      .RestRequestHandlerApi
      .prototype
      .resourceRestRequestHandlerAddEventPOST = fakeAddAppSensorEventFn
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should call next() when there\'s no blacklisted value found in header', () => {
    const request = {
      headers: {
        'some_header': 'some_value',
        'x-forwarded-for': '127.0.0.1',
        'Content-Type': 'application/json'
      }
    }
    const req = mockReq(request)
    const res = mockRes()
    const next = sinon.spy()

    checkHeadersForXssPayload(req, res, next)
    expect(next).to.be.called
  })

  it('should post a new IE1 event to AppSensor', () => {
    clientCore.commonXssPayloads.forEach((commonXssPayload) => {
      const request = {
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'some_header': commonXssPayload,
          'Content-Type': 'application/json'
        }
      }

      checkHeadersForXssPayload(mockReq(request), mockRes(), sinon.spy())
      expect(fakeAddAppSensorEventFn).to.be.calledWith(
        sinon.match({
          detectionPoint: {
            label: 'IE1'
          }
        })
      )
    })
  })

  it('should respond with HTTP 400 Bad Request', async (done) => {
    clientCore.commonXssPayloads.forEach((commonXssPayload) => {
      const request = {
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'some_header': commonXssPayload,
          'Content-Type': 'application/json'
        }
      }

      const res = mockRes()
      checkHeadersForXssPayload(mockReq(request), res, sinon.spy())
      setTimeout(function () {
        expect(res.send).to.be.calledWith(408)
      }, 5)
    })

    done()
  })
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable', () => {
    clientCore.commonXssPayloads.forEach((commonXssPayload) => {
      const request = {
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'some_header': commonXssPayload,
          'Content-Type': 'application/json'
        }
      }

      const res = mockRes()

      checkHeadersForXssPayload(mockReq(request), res, sinon.spy())
      expect(res.send).to.be.calledWith(500)
    })
  })
})

/*describe('checkBodyForXssPayload', () => {
  it('should call next() when there\'s no blacklisted value found in HTTP payload')
  it('should post a new IE1 event to AppSensor')
  it('should respond with HTTP 400 Bad Request')
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable')
})

describe('requestContainsMaliciousHeaders', () => {
  it('should return true if given header array contains a value from blacklist')
  it('should return false if given header array doesn\'t contain a value from blacklist')
})*/