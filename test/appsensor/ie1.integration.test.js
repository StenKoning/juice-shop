const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)
chai.use(require('chai-datetime'))
chai.use(require('chai-http'))
chai.use(require('chai-as-promised'))
const request = chai.request
const appsensor = require('../../appsensor/api')
const server = require('../../server')
const insecurity = require('../../lib/insecurity')
const Promise = require('bluebird')

let fakeAddAppSensorEventFn

describe('Given we receive a request with malicious XSS headers', () => {
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

  it('should respond with HTTP 400 Bad Request & send IE1 to AppSensor', async (done) => {
    await request(server.server)
      .get('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .set('content-type', 'application/json')
      .set('some_header', '<IMG SRC="javascript:alert(\'XSS\');">')
      .send()
      .then(function (res) {
        expect(res).to.have.status(400)
        expect(fakeAddAppSensorEventFn).to.be.calledWith(
          sinon.match({
            detectionPoint: {
              label: 'IE1'
            }
          })
        )
      })
    done()
  })

  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable', async (done) => {
    fakeAddAppSensorEventFn = sinon.fake.returns(Promise.reject({ error: 'empty error' }))
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
        expect(fakeAddAppSensorEventFn).to.be.calledWith(
          sinon.match({
            detectionPoint: {
              label: 'IE1'
            }
          })
        )
      })
    done()
  })
})

describe('Given a malicious HTTP body', () => {

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

  it('should respond with HTTP 400 Bad Request & send IE1 to AppSensor', async (done) => {
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
        expect(fakeAddAppSensorEventFn).to.be.calledWith(
          sinon.match({
            detectionPoint: {
              label: 'IE1'
            }
          })
        )
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
        expect(fakeAddAppSensorEventFn).to.be.calledWith(
          sinon.match({
            detectionPoint: {
              label: 'IE1'
            }
          })
        )
      })
    done()
  })
})