// require files in Node.js environment
var JsonInterval;
if (typeof module === 'object' && module.exports) {
  
  JsonInterval = require('./JsonInterval.js');
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonThreshold', ['jquery', 'appsensor/model/JsonInterval'],
    function($JsonInterval) {
      return JsonThreshold;
   });
}

/**
 * 
 **/
var JsonThreshold = function JsonThreshold() { 
  var self = this;
  
  /**
   * 
   * datatype: Number
   **/
  self.count = null;
  
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
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.count = data.count;
    
    self.id = data.id;
    
    self.interval.constructFromObject(data.interval);
    
  }

  
  /**
   * get 
   * @return {Number}
   **/
  self.getCount = function() {
    return self.count;
  }

  /**
   * set 
   * @param {Number} count
   **/
  self.setCount = function (count) {
    self.count = count;
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
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonThreshold;
}
