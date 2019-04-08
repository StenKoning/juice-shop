// require files in Node.js environment

if (typeof module === 'object' && module.exports) {
  
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonInterval', ['jquery'],
    function($) {
      return JsonInterval;
   });
}

/**
 * 
 **/
var JsonInterval = function JsonInterval() { 
  var self = this;
  
  /**
   * 
   * datatype: Number
   **/
  self.duration = null;
  
  /**
   * 
   * datatype: String
   **/
  self.id = null;
  
  /**
   * 
   * datatype: String
   **/
  self.unit = null;
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.duration = data.duration;
    
    self.id = data.id;
    
    self.unit = data.unit;
    
  }

  
  /**
   * get 
   * @return {Number}
   **/
  self.getDuration = function() {
    return self.duration;
  }

  /**
   * set 
   * @param {Number} duration
   **/
  self.setDuration = function (duration) {
    self.duration = duration;
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
  self.getUnit = function() {
    return self.unit;
  }

  /**
   * set 
   * @param {String} unit
   **/
  self.setUnit = function (unit) {
    self.unit = unit;
  }
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonInterval;
}
