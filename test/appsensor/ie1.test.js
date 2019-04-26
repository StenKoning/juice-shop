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
const clientCore = require('../../appsensor/clientCore')
const insecurity = require('../../lib/insecurity')
const Promise = require('bluebird')
const checkHeadersForXssPayload = require('../../appsensor/ie1').middleware.checkHeadersForXssPayload
const checkBodyForXssPayload = require('../../appsensor/ie1').middleware.checkBodyForXssPayload
const requestContainsMaliciousHeaders = require('../../appsensor/ie1').requestContainsMaliciousHeaders

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

    const next = sinon.spy()
    checkHeadersForXssPayload(mockReq(request), mockRes(), next)
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
    await request(server.server)
      .get('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .set('content-type', 'application/json')
      .set('some_header', '<IMG SRC="javascript:alert(\'XSS\');">')
      .send()
      .then(function (res) {
        expect(res).to.have.status(400)
      })
    done()
  })
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable', async (done) => {
    fakeAddAppSensorEventFn = sinon.fake.returns(Promise.reject())
    appsensor
      .RestRequestHandlerApi
      .prototype
      .resourceRestRequestHandlerAddEventPOST = fakeAddAppSensorEventFn

    await request(server.server)
      .get('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .set('content-type', 'application/json')
      .set('some_header', '<IMG SRC="javascript:alert(\'XSS\');">')
      .send()
      .then(function (res) {
        expect(res).to.have.status(502)
      })
    done()
  })
})

describe('checkBodyForXssPayload', () => {

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

  it('should call next() when there\'s no blacklisted value found in HTTP payload', () => {
    const request = {
      body: {
        'some_header': 'some_value',
        'name': 'Johnny'
      }
    }

    const next = sinon.spy()
    checkHeadersForXssPayload(mockReq(request), mockRes(), next)
    expect(next).to.be.called
  })

  it('should post a new IE1 event to AppSensor', () => {
    clientCore.commonXssPayloads.forEach((commonXssPayload) => {
      const request = {
        headers: {
          'x-forwarded-for': '127.0.0.1'
        },
        body: {
          'name': commonXssPayload
        }
      }

      checkBodyForXssPayload(mockReq(request), mockRes(), sinon.spy())
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
    await request(server.server)
      .post('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .set('content-type', 'application/json')
      .send(
        {
          'name': '<BODY ONLOAD=alert(\'XSS\')>'
        }
      )
      .then(function (res) {
        expect(res).to.have.status(400)
      })
    done()
  })

  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable', async (done) => {
    fakeAddAppSensorEventFn = sinon.fake.returns(Promise.reject())
    appsensor
      .RestRequestHandlerApi
      .prototype
      .resourceRestRequestHandlerAddEventPOST = fakeAddAppSensorEventFn

    await request(server.server)
      .post('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .set('content-type', 'application/json')
      .send(
        {
          'name': '<BODY ONLOAD=alert(\'XSS\')>'
        }
      )
      .then(function (res) {
        expect(res).to.have.status(502)
      })
    done()
  })
})

describe('requestContainsMaliciousHeaders', () => {
  it('should return true if given header array contains a value from blacklist', () => {
    const request = {
      headers: {
        'x-forwarded-for': '127.0.0.1',
        'some-malicious-header': '$@DSA' + clientCore.commonXssPayloads[0] + '#%#@#'
      }
    }

    expect(requestContainsMaliciousHeaders(mockReq(request))).to.be.true
  })
  it('should return false if given header array doesn\'t contain a value from blacklist', () => {
    const request = {
      headers: {
        'x-forwarded-for': '127.0.0.1',
        'some-malicious-header': '$@DSA#%#@#'
      }
    }

    expect(requestContainsMaliciousHeaders(mockReq(request))).to.be.false
  })
})