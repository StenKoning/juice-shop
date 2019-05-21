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

describe('Given we receive a GET request on the robots.txt file', () => {
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

  it('should report RE4 to AppSensor and block the request', async (done) => {
    await request(server.server)
      .post('/robots.txt')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .send(
        {
          BasketId: 3,
          ProductId: 2,
          quantity: 3
        }
      )
      .then(function (res) {
        expect(res).to.have.status(405)
      })
    done()
  })
})
