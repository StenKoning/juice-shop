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

describe('checkURlQueryParamtersForSqlInjection', () => {
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

  it('should return HTTP 200 OK - when there\'s no query parameters', function (done) {
    request(server.server)
      .get('/rest/product/search')
      //.query({ q: '\';' })
      .set('x-forwarded-for', '127.0.0.1')
      .set('content-type', 'application/json')
      .send()
      .then(function (res) {
        expect(res).to.have.status(200)
        expect(fakeAddAppSensorEventFn).have.not.been.called
        done()
      })
  })

  it('should return HTTP 200 OK - when query parameters don\'t contain blacklisted values', function (done) {
    request(server.server)
      .get('/rest/product/search')
      .query({ q: 'apple' })
      .set('x-forwarded-for', '127.0.0.1')
      .set('content-type', 'application/json')
      .send()
      .then(function (res) {
        expect(res).to.have.status(200)
        expect(fakeAddAppSensorEventFn).have.not.been.called
        done()
      })
  })

  it('should respond with HTTP 400 & post a new CIE1 event to AppSensor if the query parameters contain blacklisted values', function (done) {
    const blacklistedValues = [
      '\' OR \'1\'=\'1\'',
      'OR \'a\'=\'a\'',
      'OR 1=1-- xp_cmdshell UNION JOIN'
    ]

    let promisesToExecuteRequest = []

    blacklistedValues.forEach(function (blacklistedValue) {
      promisesToExecuteRequest.push(
        new Promise(function (resolve, reject) {
          request(server.server)
            .get('/rest/product/search')
            .query({ q: blacklistedValue })
            .set('x-forwarded-for', '127.0.0.1')
            .set('content-type', 'application/json')
            .send()
            .then(function (res) {
              resolve(res)
            })
            .catch(function (rejection) {
              reject(rejection)
            })
        })
      )
    })

    const promiseToMakeRequestsAndTestResults = Promise.all(promisesToExecuteRequest)
      .then(function (values) {
        expect(values.length).to.equal(3)
        values.forEach(function (res) {
          expect(res).to.have.status(400)
        })
        expect(fakeAddAppSensorEventFn).to.be.calledWithExactly(
          sinon.match({
            detectionPoint: {
              label: 'CIE1'
            }
          })
        )
        expect(fakeAddAppSensorEventFn.callCount).to.equal(3)
      })
    expect(promiseToMakeRequestsAndTestResults).to.be.fulfilled.notify(done)
  })

  it('should respond with HTTP 400 Bad Request if the query paramters contain blacklisted values', function () {

  })
})

describe('checkHeadersForSqlInjectionPayload', () => {
  it('should call next() when there\'s no blacklisted value found in HTTP payload')
  it('should post a new CIE1 event to AppSensor')
  it('should respond with HTTP 400 Bad Request')
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable')
})

describe('checkHeadersForSqlInjectionPayload', () => {
  it('should call next() when there\'s no blacklisted value found in header')
  it('should post a new CIE1 event to AppSensor')
  it('should respond with HTTP 400 Bad Request')
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable')
})