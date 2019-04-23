const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)
chai.use(require('chai-datetime'))
chai.use(require('chai-http'))
const frisby = require('frisby')
const app = require('../../server')
const appsensor = require('../../appsensor/api')
const request = chai.request

var mockRequire = require('mock-require')

const findMaliciousHeader = require('../../appsensor/detectionpoints.js').findMaliciousHeader
const buildJsonIpAddress = require('../../appsensor/detectionpoints.js').buildJsonIpAddress
const buildJsonUser = require('../../appsensor/detectionpoints.js').buildJsonUser
const buildAppSensorJsonEvent = require('../../appsensor/detectionpoints.js').buildAppSensorJsonEvent
const payloadContainsMaliciousString = require('../../appsensor/detectionpoints.js').payloadContainsMaliciousString

describe('Detection Point IE1', () => {


})
