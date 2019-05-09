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
const WebSocket = require('mock-websocket').WebSocket
const WebSocketServer = require('mock-websocket').Server
const websocketReactionLogic = require('../../appsensor/websocketReactionLogic')

let fakeAddAppSensorEventFn
let clientWebSocketFake
let mockWebsocketServer

describe('Given we receive information about a ASR-J response from AppSensor & the related user is not a guest', () => {

  beforeEach(() => {
    fakeAddAppSensorEventFn = sinon.fake.returns(Promise.resolve())
    appsensor
      .RestRequestHandlerApi
      .prototype
      .resourceRestRequestHandlerAddEventPOST = fakeAddAppSensorEventFn
    mockWebsocketServer = new WebSocketServer('ws://localhost:8085/dashboard')
    clientWebSocketFake = new WebSocket(process.env.APPSENSOR_WEB_SOCKET_HOST_URL)
    //websocketReactionLogic.openConn = sinon.fake.returns(clientWebSocketFake)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should log out the malicious user', async (done) => {
    // Log user in
    const user = await models.User.find({ where: { email: 'bjoern@owasp.org' } })
    const plainUser = utils.queryResultToJson(user)
    const token = insecurity.authorize(plainUser)
    insecurity.authenticatedUsers.put(token, plainUser)

    expect(insecurity.authenticatedUsers.get(token)).to.deep.equal(plainUser)

    // 3 events should trigger a reaction to log user out
    Promise.all([
      promiseToAttemptXssAttack,
      promiseToAttemptXssAttack,
      promiseToAttemptXssAttack
    ]).then(() => {
      mockWebsocketServer.send({
        dataType: 'response',
        dataValue: {
          user: {
            username: 'Guest',
            ipAddress: [
              Object
            ]
          },
          timestamp: '2019-05-09T10:39:41.221Z',
          action: 'logout',
          interval: {
            duration: 10,
            unit: 'minutes'
          },
          detectionSystem: {
            detectionSystemId: 'myclientapp'
          },
          metadata: [

          ],
          active: false
        }
      })
    })
      .then(new Promise(resolve => setTimeout(resolve, 50)))
      .then(function () {
        expect(insecurity.authenticatedUsers.get(token)).to.be.undefined
        done()
      })
  })

  function promiseToAttemptXssAttack () {
    return request(server.server)
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
      })
  }
})