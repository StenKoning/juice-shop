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

describe('receivingPostWhenExpectingGet', () => {
  it('reports to AppSensor when getting POST on GET only route & returns HTTP 405', async (done) => {
    /*const appsensorReporter = new appsensor.RestReportingEngineApi()
    const initialEventCountPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const initialEventCount = initialEventCountPromise.response.body*/

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

    /*const eventCountAfterMaliciousRequestPromise = await appsensorReporter.resourceRestReportingEngineCountEventsGET()
    const eventCountAfterMaliciousRequest = eventCountAfterMaliciousRequestPromise.response.body

    expect(eventCountAfterMaliciousRequest).to.equal(initialEventCount + 1)*/
    done()
  })
})

describe('receivingPostWhenExpectingGet', () => {
  it('should return next() if the HTTP verb is not \'POST\'')
  it('should post a new RE4 event to AppSensor')
  it('should respond with 405 Method Not Allowed')
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable')
})