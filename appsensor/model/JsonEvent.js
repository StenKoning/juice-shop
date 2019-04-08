// require files in Node.js environment
var JsonDetectionpoint;var JsonDetectionsystem;var JsonKeyvaluepair;var JsonResource;var JsonUser;
if (typeof module === 'object' && module.exports) {
  
  JsonDetectionpoint = require('./JsonDetectionpoint.js');
  JsonDetectionsystem = require('./JsonDetectionsystem.js');
  JsonKeyvaluepair = require('./JsonKeyvaluepair.js');
  JsonResource = require('./JsonResource.js');
  JsonUser = require('./JsonUser.js');
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonEvent', ['jquery', 'appsensor/model/JsonDetectionpoint', 'JsonDetectionsystem', 'Array', 'JsonResource', 'JsonUser'],
    function($, JsonDetectionpoint, JsonDetectionsystem, Array, JsonResourceJsonUser) {
      return JsonEvent;
   });
}

/**
 * 
 **/
var JsonEvent = function JsonEvent() { 
  var self = this;
  
  /**
   * 
   * datatype: JsonDetectionpoint
   **/
  self.detectionPoint = new json_detectionpoint();
  
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
   * datatype: Array
   **/
  self.metadata = [];
  
  /**
   * 
   * datatype: JsonResource
   **/
  self.resource = new json_resource();
  
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
    
    self.detectionPoint.constructFromObject(data.detectionPoint);
    
    self.detectionSystem.constructFromObject(data.detectionSystem);
    
    self.id = data.id;
    
    self.metadata = new Array();
    
    self.resource.constructFromObject(data.resource);
    
    self.timestamp = data.timestamp;
    
    self.user.constructFromObject(data.user);
    
  }

  
  /**
   * get 
   * @return {JsonDetectionpoint}
   **/
  self.getDetectionPoint = function() {
    return self.detectionPoint;
  }

  /**
   * set 
   * @param {JsonDetectionpoint} detectionPoint
   **/
  self.setDetectionPoint = function (detectionPoint) {
    self.detectionPoint = detectionPoint;
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
   * @return {JsonResource}
   **/
  self.getResource = function() {
    return self.resource;
  }

  /**
   * set 
   * @param {JsonResource} resource
   **/
  self.setResource = function (resource) {
    self.resource = resource;
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
  module.exports = JsonEvent;
}
