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

describe('Given we are probing for SQL injection vulnerabilities in the query parameters', () => {
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

  it('should do nothing - when there\'s no query parameters', async (done) => {
    request(server.server)
      .get('/rest/product/search')
      .set('x-forwarded-for', '127.0.0.1')
      .set('content-type', 'application/json')
      .send()
      .then(function (res) {
        expect(res).to.have.status(200)
        expect(fakeAddAppSensorEventFn).have.not.been.called
        done()
      })
  })

  it('should do nothing special - when query parameters don\'t contain blacklisted values', async (done) => {
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

  it('should detect, block & post CIE1 event to AppSensor - when blacklisted value found', async (done) => {
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
        expect(fakeAddAppSensorEventFn.alwaysCalledWithMatch(
          sinon.match({
            detectionPoint: {
              label: 'CIE1'
            }
          })
        )).to.be.true
        expect(fakeAddAppSensorEventFn.callCount).to.equal(3)
      })
    expect(promiseToMakeRequestsAndTestResults).to.be.fulfilled.notify(done)
  })
})

describe('Given we are probing for SQL injection vulnerabilities in the header values', () => {
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

  it('should do nothing special - when there\'s no blacklisted values found in the headers', async (done) => {
    request(server.server)
      .get('/rest/product/search')
      .set('x-forwarded-for', '127.0.0.1')
      .set('content-type', 'application/json')
      .set('some_header', 'some string in the header that is not sql injection attempt')
      .send()
      .then(function (res) {
        expect(res).to.have.status(200)
        expect(fakeAddAppSensorEventFn).have.not.been.called
        done()
      })
  })

  it('should detect, block & post CIE1 event to AppSensor - when blacklisted value found', async (done) => {
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
            .set('x-forwarded-for', '127.0.0.1')
            .set('content-type', 'application/json')
            .set('some_header', blacklistedValue)
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
        expect(fakeAddAppSensorEventFn).to.be.calledWith(
          sinon.match({
            detectionPoint: {
              label: 'CIE1'
            }
          })
        )
        expect(fakeAddAppSensorEventFn.alwaysCalledWithMatch(
          sinon.match({
            detectionPoint: {
              label: 'CIE1'
            }
          })
        )).to.be.true
        expect(fakeAddAppSensorEventFn.callCount).to.equal(3)
      })
    expect(promiseToMakeRequestsAndTestResults).to.be.fulfilled.notify(done)
  })
})

describe('Given we are probing for SQL injection vulnerabilities in HTTP payloads', () => {
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

  it('should detect, block & post CIE1 event to AppSensor - when blacklisted value found', async (done) => {
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
            .post('/login')
            .set('x-forwarded-for', '127.0.0.1')
            .set('content-type', 'application/json')
            .send({ email: blacklistedValue, password: 'test123' })
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
        expect(fakeAddAppSensorEventFn).to.be.calledWith(
          sinon.match({
            detectionPoint: {
              label: 'CIE1'
            }
          })
        )
        expect(fakeAddAppSensorEventFn.alwaysCalledWithMatch(
          sinon.match({
            detectionPoint: {
              label: 'CIE1'
            }
          })
        )).to.be.true
        expect(fakeAddAppSensorEventFn.callCount).to.equal(3)
      })
    expect(promiseToMakeRequestsAndTestResults).to.be.fulfilled.notify(done)
  })
})
