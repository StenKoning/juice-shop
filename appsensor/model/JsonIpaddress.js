// require files in Node.js environment
var JsonGeolocation;
if (typeof module === 'object' && module.exports) {
  
  JsonGeolocation = require('./JsonGeolocation.js');
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonIpaddress', ['jquery', 'appsensor/model/JsonGeolocation'],
    function($, JsonGeolocation) {
      return JsonIpaddress;
   });
}

/**
 * 
 **/
var JsonIpaddress = function JsonIpaddress() { 
  var self = this;
  
  /**
   * 
   * datatype: String
   **/
  self.address = null;
  
  /**
   * 
   * datatype: JsonGeolocation
   **/
  self.geoLocation = new json_geolocation();
  
  /**
   * 
   * datatype: String
   **/
  self.id = null;
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.address = data.address;
    
    self.geoLocation.constructFromObject(data.geoLocation);
    
    self.id = data.id;
    
  }

  
  /**
   * get 
   * @return {String}
   **/
  self.getAddress = function() {
    return self.address;
  }

  /**
   * set 
   * @param {String} address
   **/
  self.setAddress = function (address) {
    self.address = address;
  }
  
  /**
   * get 
   * @return {JsonGeolocation}
   **/
  self.getGeoLocation = function() {
    return self.geoLocation;
  }

  /**
   * set 
   * @param {JsonGeolocation} geoLocation
   **/
  self.setGeoLocation = function (geoLocation) {
    self.geoLocation = geoLocation;
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
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonIpaddress;
}
