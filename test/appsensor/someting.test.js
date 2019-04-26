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
const Promise = require('bluebird')

const clientCore = require('../../appsensor/clientCore')

const checkHeadersForXssPayload = require('../../appsensor/ie1').middleware.checkHeadersForXssPayload

describe('IE1', () => {

  beforeEach(() => {

  })

  afterEach(() => {
    //appsensor.RestRequestHandlerApi.resourceRestRequestHandlerAddEventPOST.restore()
  })

  it('checkHeadersForXssPayload', async (done) => {
    appsensor
      .RestRequestHandlerApi
      .prototype
      .resourceRestRequestHandlerAddEventPOST = sinon.fake.returns(Promise.resolve({ a: 1 }))

    clientCore.postEventToAppSensor({ a: 99 })
      .then((value) => {
        console.log(value)
      })

    sinon.restore()
    done()
  })


})

