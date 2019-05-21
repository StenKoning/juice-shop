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

let fakeAddAppSensorEventFn

describe('Given we receive a GET request when we expect a POST on a file-upload', () => {
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

  it('should sent a RE3 event to AppSensor', async (done) => {
    await request(server.server)
      .get('/file-upload')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .send()
      .then(function (res) {
        expect(res).to.have.status(405)
        expect(fakeAddAppSensorEventFn).to.be.calledOnceWith(
          sinon.match({
            detectionPoint: {
              label: 'RE3'
            }
          })
        )
      })
    done()
  })
})
