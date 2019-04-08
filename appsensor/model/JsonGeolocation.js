// require files in Node.js environment

if (typeof module === 'object' && module.exports) {
  
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonGeolocation', ['jquery'],
    function($) {
      return JsonGeolocation;
   });
}

/**
 * 
 **/
var JsonGeolocation = function JsonGeolocation() { 
  var self = this;
  
  /**
   * 
   * datatype: String
   **/
  self.id = null;
  
  /**
   * 
   * datatype: Number
   **/
  self.latitude = null;
  
  /**
   * 
   * datatype: Number
   **/
  self.longitude = null;
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.id = data.id;
    
    self.latitude = data.latitude;
    
    self.longitude = data.longitude;
    
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
   * @return {Number}
   **/
  self.getLatitude = function() {
    return self.latitude;
  }

  /**
   * set 
   * @param {Number} latitude
   **/
  self.setLatitude = function (latitude) {
    self.latitude = latitude;
  }
  
  /**
   * get 
   * @return {Number}
   **/
  self.getLongitude = function() {
    return self.longitude;
  }

  /**
   * set 
   * @param {Number} longitude
   **/
  self.setLongitude = function (longitude) {
    self.longitude = longitude;
  }
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonGeolocation;
}
