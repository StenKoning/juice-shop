// require files in Node.js environment
var JsonIpaddress;
if (typeof module === 'object' && module.exports) {
  
  JsonIpaddress = require('./JsonIpaddress.js');
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonDetectionsystem', ['jquery', 'appsensor/model/JsonIpaddress'],
    function($JsonIpaddress) {
      return JsonDetectionsystem;
   });
}

/**
 * 
 **/
var JsonDetectionsystem = function JsonDetectionsystem() { 
  var self = this;
  
  /**
   * 
   * datatype: String
   **/
  self.detectionSystemId = null;
  
  /**
   * 
   * datatype: String
   **/
  self.id = null;
  
  /**
   * 
   * datatype: JsonIpaddress
   **/
  self.ipAddress = new json_ipaddress();
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.detectionSystemId = data.detectionSystemId;
    
    self.id = data.id;
    
    self.ipAddress.constructFromObject(data.ipAddress);
    
  }

  
  /**
   * get 
   * @return {String}
   **/
  self.getDetectionSystemId = function() {
    return self.detectionSystemId;
  }

  /**
   * set 
   * @param {String} detectionSystemId
   **/
  self.setDetectionSystemId = function (detectionSystemId) {
    self.detectionSystemId = detectionSystemId;
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
   * @return {JsonIpaddress}
   **/
  self.getIpAddress = function() {
    return self.ipAddress;
  }

  /**
   * set 
   * @param {JsonIpaddress} ipAddress
   **/
  self.setIpAddress = function (ipAddress) {
    self.ipAddress = ipAddress;
  }
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonDetectionsystem;
}
