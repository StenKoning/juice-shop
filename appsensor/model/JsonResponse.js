// require files in Node.js environment
var JsonDetectionsystem;var JsonInterval;var JsonKeyvaluepair;var JsonUser;
if (typeof module === 'object' && module.exports) {
  
  JsonDetectionsystem = require('./JsonDetectionsystem.js');
  JsonInterval = require('./JsonInterval.js');
  JsonKeyvaluepair = require('./JsonKeyvaluepair.js');
  JsonUser = require('./JsonUser.js');
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonResponse', ['jquery', 'appsensor/model/JsonDetectionsystem', 'JsonInterval', 'Array', 'JsonUser'],
    function($, JsonDetectionsystem, JsonInterval, ArrayJsonUser) {
      return JsonResponse;
   });
}

/**
 * 
 **/
var JsonResponse = function JsonResponse() { 
  var self = this;
  
  /**
   * 
   * datatype: String
   **/
  self.action = null;
  
  /**
   * 
   * datatype: Boolean
   **/
  self.active = null;
  
  /**
   * 
   * datatype: JsonDetectionsystem
   **/
  self.detectionSystem = new json_detectionsystem();
  
  /**
   * 
   * datatype: String
   **/
  self.id = null;
  
  /**
   * 
   * datatype: JsonInterval
   **/
  self.interval = new json_interval();
  
  /**
   * 
   * datatype: Array
   **/
  self.metadata = [];
  
  /**
   * 
   * datatype: String
   **/
  self.timestamp = null;
  
  /**
   * 
   * datatype: JsonUser
   **/
  self.user = new json_user();
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.action = data.action;
    
    self.active = data.active;
    
    self.detectionSystem.constructFromObject(data.detectionSystem);
    
    self.id = data.id;
    
    self.interval.constructFromObject(data.interval);
    
    self.metadata = new Array();
    
    self.timestamp = data.timestamp;
    
    self.user.constructFromObject(data.user);
    
  }

  
  /**
   * get 
   * @return {String}
   **/
  self.getAction = function() {
    return self.action;
  }

  /**
   * set 
   * @param {String} action
   **/
  self.setAction = function (action) {
    self.action = action;
  }
  
  /**
   * get 
   * @return {Boolean}
   **/
  self.getActive = function() {
    return self.active;
  }

  /**
   * set 
   * @param {Boolean} active
   **/
  self.setActive = function (active) {
    self.active = active;
  }
  
  /**
   * get 
   * @return {JsonDetectionsystem}
   **/
  self.getDetectionSystem = function() {
    return self.detectionSystem;
  }

  /**
   * set 
   * @param {JsonDetectionsystem} detectionSystem
   **/
  self.setDetectionSystem = function (detectionSystem) {
    self.detectionSystem = detectionSystem;
  }
  
  /**
   * get 
   * @return {String}
   **/
  self.getId = function() {
    return self.id;
  }

  /**
   * set 
   * @param {String} id
   **/
  self.setId = function (id) {
    self.id = id;
  }
  
  /**
   * get 
   * @return {JsonInterval}
   **/
  self.getInterval = function() {
    return self.interval;
  }

  /**
   * set 
   * @param {JsonInterval} interval
   **/
  self.setInterval = function (interval) {
    self.interval = interval;
  }
  
  /**
   * get 
   * @return {Array}
   **/
  self.getMetadata = function() {
    return self.metadata;
  }

  /**
   * set 
   * @param {Array} metadata
   **/
  self.setMetadata = function (metadata) {
    self.metadata = metadata;
  }
  
  /**
   * get 
   * @return {String}
   **/
  self.getTimestamp = function() {
    return self.timestamp;
  }

  /**
   * set 
   * @param {String} timestamp
   **/
  self.setTimestamp = function (timestamp) {
    self.timestamp = timestamp;
  }
  
  /**
   * get 
   * @return {JsonUser}
   **/
  self.getUser = function() {
    return self.user;
  }

  /**
   * set 
   * @param {JsonUser} user
   **/
  self.setUser = function (user) {
    self.user = user;
  }
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonResponse;
}
