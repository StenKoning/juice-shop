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

describe('checkURlQueryParamtersForSqlInjection', () => {
  it('should call next() when there\'s no query parameters')
  it('should post a new CIE1 event to AppSensor if the query parameters contain blacklisted values')
  it('should respond with HTTP 400 Bad Request if the query paramters contain blacklisted values')
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable')
})

describe('checkHeadersForSqlInjectionPayload', () => {
  it('should call next() when there\'s no blacklisted value found in HTTP payload')
  it('should post a new CIE1 event to AppSensor')
  it('should respond with HTTP 400 Bad Request')
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable')
})

describe('checkHeadersForSqlInjectionPayload', () => {
  it('should call next() when there\'s no blacklisted value found in header')
  it('should post a new CIE1 event to AppSensor')
  it('should respond with HTTP 400 Bad Request')
  it('should respond with HTTP 502 Bad Gateway if AppSensor server is unavailable')
})