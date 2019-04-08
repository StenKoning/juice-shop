// require files in Node.js environment
var JsonResponse;var JsonThreshold;
if (typeof module === 'object' && module.exports) {
  
  JsonResponse = require('./JsonResponse.js');
  JsonThreshold = require('./JsonThreshold.js');
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonDetectionpoint', ['jquery', 'Array', 'appsensor/model/JsonThreshold'],
    function($, ArrayJsonThreshold) {
      return JsonDetectionpoint;
   });
}

/**
 * 
 **/
var JsonDetectionpoint = function JsonDetectionpoint() { 
  var self = this;
  
  /**
   * 
   * datatype: String
   **/
  self.category = null;
  
  /**
   * 
   * datatype: String
   **/
  self.id = null;
  
  /**
   * 
   * datatype: String
   **/
  self.label = null;
  
  /**
   * 
   * datatype: Array
   **/
  self.responses = [];
  
  /**
   * 
   * datatype: JsonThreshold
   **/
  self.threshold = new json_threshold();
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.category = data.category;
    
    self.id = data.id;
    
    self.label = data.label;
    
    self.responses = new Array();
    
    self.threshold.constructFromObject(data.threshold);
    
  }

  
  /**
   * get 
   * @return {String}
   **/
  self.getCategory = function() {
    return self.category;
  }

  /**
   * set 
   * @param {String} category
   **/
  self.setCategory = function (category) {
    self.category = category;
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
   * @return {String}
   **/
  self.getLabel = function() {
    return self.label;
  }

  /**
   * set 
   * @param {String} label
   **/
  self.setLabel = function (label) {
    self.label = label;
  }
  
  /**
   * get 
   * @return {Array}
   **/
  self.getResponses = function() {
    return self.responses;
  }

  /**
   * set 
   * @param {Array} responses
   **/
  self.setResponses = function (responses) {
    self.responses = responses;
  }
  
  /**
   * get 
   * @return {JsonThreshold}
   **/
  self.getThreshold = function() {
    return self.threshold;
  }

  /**
   * set 
   * @param {JsonThreshold} threshold
   **/
  self.setThreshold = function (threshold) {
    self.threshold = threshold;
  }
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonDetectionpoint;
}
