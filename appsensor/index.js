if (typeof module === 'object' && module.exports) {
  var AppsensorWsRestServer = {};

  AppsensorWsRestServer.json_attack = require('./model/JsonAttack');

  AppsensorWsRestServer.json_detectionpoint = require('./model/JsonDetectionpoint');

  AppsensorWsRestServer.json_detectionsystem = require('./model/JsonDetectionsystem');

  AppsensorWsRestServer.json_event = require('./model/JsonEvent');

  AppsensorWsRestServer.json_geolocation = require('./model/JsonGeolocation');

  AppsensorWsRestServer.json_ipaddress = require('./model/JsonIpaddress');

  AppsensorWsRestServer.json_interval = require('./model/JsonInterval');

  AppsensorWsRestServer.json_keyvaluepair = require('./model/JsonKeyvaluepair');

  AppsensorWsRestServer.json_resource = require('./model/JsonResource');

  AppsensorWsRestServer.json_response = require('./model/JsonResponse');

  AppsensorWsRestServer.json_threshold = require('./model/JsonThreshold');

  AppsensorWsRestServer.json_user = require('./model/JsonUser');


  AppsensorWsRestServer.RestReportingEngineApi = require('./api/RestReportingEngineApi');

  AppsensorWsRestServer.RestRequestHandlerApi = require('./api/RestRequestHandlerApi');

  module.exports = AppsensorWsRestServer;
}