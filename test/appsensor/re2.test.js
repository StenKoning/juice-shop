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

describe('unexpectedHttpMethodIsUsed', () => {
  it('reports to AppSensor when an unexpected method is used for a route & returns HTTP 405', async (done) => {
    request(server.server)
      .copy('/api/BasketItems')
      .set('x-forwarded-for', '127.0.0.1')
      .set('Authorization', 'Bearer ' + insecurity.authorize())
      .set('content-type', 'application/json')
      .send()
      .then(function (res) {
        expect(res).to.have.status(405)
        done()
      })
  })
})

describe('attemptToInvokeUnsupportedHttpMethod', () => {
  it('should return next() if the HTTP verb differs from \'HEAD\', \'GET\', \'POST\', \'PUT\', \'DELETE\', \'TRACE\', \'OPTIONS\', \'CONNECT\'')
  it('should post a new RE2 event to AppSensor')
  it('should respond with 405 Method Not Allowed')
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable')
})
