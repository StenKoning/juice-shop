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

describe('Given we are trying to invoke an unusual HTTP Method', () => {
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

  it('should not send a RE2 event if HTTP Method is in whitelist', async (done) => {
    let promisesToMakeRequest = []
    const allowedMethods = ['HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'OPTIONS', 'CONNECT']
    allowedMethods.forEach((allowedMethod) => {
      promisesToMakeRequest.push(new Promise((resolve, reject) => {
        var method = allowedMethod.toLowerCase()
        request(server.server)[method]('/rest/admin/application-configuration')
          .set('x-forwarded-for', '127.0.0.1')
          .set('content-type', 'application/json')
          .send()
          .catch()
          .finally(() => {
            const re2HasBeenSent = fakeAddAppSensorEventFn.calledWithMatch(
              sinon.match({
                detectionPoint: {
                  label: 'RE2'
                }
              })
            )
            if (re2HasBeenSent) {
              // eslint-disable-next-line prefer-promise-reject-errors
              return reject({ method: method, re2HasBeenSent: re2HasBeenSent })
            }
            resolve()
          })
          .catch(reject)
      }))
    })

    expect(Promise.all(promisesToMakeRequest)).to.be.fulfilled.notify(done)
  })
  it('should post a RE2 Event to AppSensor & block request if method not in whitelist', async (done) => {
    request(server.server)
      .copy('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .set('content-type', 'application/json')
      .send()
      .then(function (res) {
        expect(res).to.have.status(405)
        expect(fakeAddAppSensorEventFn).to.be.calledOnceWith(
          sinon.match({
            detectionPoint: {
              label: 'RE2'
            }
          })
        )
        done()
      })
  })
})
