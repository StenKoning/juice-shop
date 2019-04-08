// require files in Node.js environment
var JsonIpaddress;
if (typeof module === 'object' && module.exports) {
  
  JsonIpaddress = require('./JsonIpaddress.js');
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonUser', ['jquery', 'appsensor/model/JsonIpaddress'],
    function($, JsonIpaddress) {
      return JsonUser;
   });
}

/**
 * 
 **/
var JsonUser = function JsonUser() { 
  var self = this;
  
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
  
  /**
   * 
   * datatype: String
   **/
  self.username = null;
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.id = data.id;
    
    self.ipAddress.constructFromObject(data.ipAddress);
    
    self.username = data.username;
    
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
  
  /**
   * get 
   * @return {String}
   **/
  self.getUsername = function() {
    return self.username;
  }

  /**
   * set 
   * @param {String} username
   **/
  self.setUsername = function (username) {
    self.username = username;
  }
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonUser;
}
