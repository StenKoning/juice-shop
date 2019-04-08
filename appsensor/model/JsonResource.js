// require files in Node.js environment

if (typeof module === 'object' && module.exports) {
  
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonResource', ['jquery'],
    function($) {
      return JsonResource;
   });
}

/**
 * 
 **/
var JsonResource = function JsonResource() { 
  var self = this;
  
  /**
   * 
   * datatype: String
   **/
  self.id = null;
  
  /**
   * 
   * datatype: String
   **/
  self.location = null;
  
  /**
   * 
   * datatype: String
   **/
  self.method = null;
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.id = data.id;
    
    self.location = data.location;
    
    self.method = data.method;
    
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
  self.getLocation = function() {
    return self.location;
  }

  /**
   * set 
   * @param {String} location
   **/
  self.setLocation = function (location) {
    self.location = location;
  }
  
  /**
   * get 
   * @return {String}
   **/
  self.getMethod = function() {
    return self.method;
  }

  /**
   * set 
   * @param {String} method
   **/
  self.setMethod = function (method) {
    self.method = method;
  }
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonResource;
}
