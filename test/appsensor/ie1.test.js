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
const models = require('../../models/index')
const utils = require('../../lib/utils')

let fakeAddAppSensorEventFn

describe('Given \'bjoern@owasp.org\' executes a request with malicious headers to his basket', () => {
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

  it('should block request, & report \'bjoern@owasp.org\' as IE1 event to AppSensor', async (done) => {
    const user = await models.User.find({ where: { email: 'bjoern@owasp.org' } })
    const plainUser = utils.queryResultToJson(user)
    const token = insecurity.authorize(plainUser)
    insecurity.authenticatedUsers.put(token, plainUser)

    request(server.server)
      .get('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + token)
      .set('content-type', 'application/json')
      .set('some_header', '<IMG SRC="javascript:alert(\'XSS\');">')
      .send()
      .then(function (res) {
        expect(res).to.have.status(400)
        expect(fakeAddAppSensorEventFn).to.be.calledOnceWith(
          sinon.match({
            detectionPoint: {
              label: 'IE1'
            },
            user: {
              username: 'bjoern@owasp.org'
            }
          })
        )
        done()
      })
  })
})

describe('Given a malicious HTTP body', () => {
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

  it('should respond with HTTP 400 Bad Request & send IE1 to AppSensor', async (done) => {
    request(server.server)
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
        expect(fakeAddAppSensorEventFn).to.be.calledOnceWith(
          sinon.match({
            detectionPoint: {
              label: 'IE1'
            }
          })
        )
        done()
      })
  })
})
