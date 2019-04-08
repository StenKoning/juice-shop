// require files in Node.js environment

if (typeof module === 'object' && module.exports) {
  
}




//export module
if ( typeof define === "function" && define.amd ) {
  define('JsonKeyvaluepair', ['jquery'],
    function($) {
      return JsonKeyvaluepair;
   });
}

/**
 * 
 **/
var JsonKeyvaluepair = function JsonKeyvaluepair() { 
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
  self.key = null;
  
  /**
   * 
   * datatype: String
   **/
  self.value = null;
  
  
  self.constructFromObject = function(data) {
    if (!data) {
      return;
    }
    
    self.id = data.id;
    
    self.key = data.key;
    
    self.value = data.value;
    
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
  self.getKey = function() {
    return self.key;
  }

  /**
   * set 
   * @param {String} key
   **/
  self.setKey = function (key) {
    self.key = key;
  }
  
  /**
   * get 
   * @return {String}
   **/
  self.getValue = function() {
    return self.value;
  }

  /**
   * set 
   * @param {String} value
   **/
  self.setValue = function (value) {
    self.value = value;
  }
  

  self.toJson = function () {
    return JSON.stringify(self);
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = JsonKeyvaluepair;
}
