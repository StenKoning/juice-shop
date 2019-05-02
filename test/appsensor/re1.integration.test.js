const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)
chai.use(require('chai-datetime'))
chai.use(require('chai-http'))
const request = chai.request
const appsensor = require('../../appsensor/api')
const server = require('../../server')
const insecurity = require('../../lib/insecurity')
const Promise = require('bluebird')

let fakeAddAppSensorEventFn

describe('Given unexpectedHttpMethodIsUsed on a route', () => {
  beforeEach(() => {
    fakeAddAppSensorEventFn = sinon.fake.returns(Promise.resolve())
    appsensor
      .RestRequestHandlerApi
      .prototype
      .resourceRestRequestHandlerAddEventPOST = fakeAddAppSensorEventFn
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should return status 405 and post a new RE1 event to AppSensor', async function (done) {
    request(server.server)
      .trace('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .set('content-type', 'application/json')
      .send()
      .then(function (res) {
        expect(res).to.have.status(405)
        expect(fakeAddAppSensorEventFn).to.be.calledOnce()
        expect(fakeAddAppSensorEventFn).to.be.calledWith(
          sinon.match({
            detectionPoint: {
              label: 'RE1'
            }
          })
        )
        done()
      })
  })

  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable', async (done) => {
    fakeAddAppSensorEventFn = sinon.fake.returns(Promise.reject())
    appsensor
      .RestRequestHandlerApi
      .prototype
      .resourceRestRequestHandlerAddEventPOST = fakeAddAppSensorEventFn

    request(server.server)
      .trace('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .set('content-type', 'application/json')
      .send()
      .then(function (res) {
        expect(res).to.have.status(502)
        expect(fakeAddAppSensorEventFn).to.be.calledOnce()
        expect(fakeAddAppSensorEventFn).to.be.calledWith(
          sinon.match({
            detectionPoint: {
              label: 'RE1'
            }
          })
        )
        done()
      })
  })
})

describe('unexpectedHttpMethodIsUsed', () => {
  it('should return next() if there is no route that matches the current url')
  it('should post a new RE1 event to AppSensor if an unexpectedHttpMethod is used')
  it('should respond with 405 Method Not Allowed')
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable')
})