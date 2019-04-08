// require files in Node.js environment
var $, JsonAttack, JsonEvent, JsonResponse;
if (typeof module === 'object' && module.exports) {
  $ = require('jquery');
  JsonAttack = require('../model/JsonAttack.js');
  JsonEvent = require('../model/JsonEvent.js');
  JsonResponse = require('../model/JsonResponse.js');
}

// export module for AMD
if ( typeof define === "function" && define.amd ) {     
	define(['jquery', 'JsonAttack', 'JsonEvent', 'JsonResponse'], function($, JsonAttack, JsonEvent, JsonResponse) {
        return RestRequestHandlerApi;
	 });
}

var RestRequestHandlerApi = function RestRequestHandlerApi() {
	var self = this;
  
  
  /**
   * 
   * 
   * @param {JsonAttack}  body 
   * @param {function} callback the callback function
   * @return void
   */
  self.resourceRestRequestHandlerAddAttackPOST = function(body, callback) {
    var postBody = JSON.stringify(body);
    var postBinaryBody = null;
    
    // create path and map variables
    var basePath = 'http://localhost:8085';
    // if basePath ends with a /, remove it as path starts with a leading /
    if (basePath.substring(basePath.length-1, basePath.length)=='/') {
    	basePath = basePath.substring(0, basePath.length-1);
    }
    
    var path = basePath + replaceAll(replaceAll("/api/v1.0/attacks", "\\{format\\}","json"));

    var queryParams = {};
    var headerParams =  {};
    var formParams =  {};

    
    
    

    path += createQueryString(queryParams);

    var options = {type: "POST", async: true, contentType: "application/json", dataType: "json", data: postBody};
    var request = $.ajax(path, options);

    request.fail(function(jqXHR, textStatus, errorThrown){
      if (callback) {
        var error = errorThrown || textStatus || jqXHR.statusText || 'error';
        callback(null, textStatus, jqXHR, error);
      }
    });
		
    request.done(function(response, textStatus, jqXHR){
      
      if (callback) {
        callback(response, textStatus, jqXHR);
      }
      
    });
 
    return request;
  }
  
  /**
   * 
   * 
   * @param {JsonEvent}  body 
   * @param {function} callback the callback function
   * @return void
   */
  self.resourceRestRequestHandlerAddEventPOST = function(body, callback) {
    var postBody = JSON.stringify(body);
    var postBinaryBody = null;
    
    // create path and map variables
    var basePath = 'http://localhost:8085';
    // if basePath ends with a /, remove it as path starts with a leading /
    if (basePath.substring(basePath.length-1, basePath.length)=='/') {
    	basePath = basePath.substring(0, basePath.length-1);
    }
    
    var path = basePath + replaceAll(replaceAll("/api/v1.0/events", "\\{format\\}","json"));

    var queryParams = {};
    var headerParams =  {};
    var formParams =  {};

    
    
    

    path += createQueryString(queryParams);

    var options = {type: "POST", async: true, contentType: "application/json", dataType: "json", data: postBody};
    var request = $.ajax(path, options);

    request.fail(function(jqXHR, textStatus, errorThrown){
      if (callback) {
        var error = errorThrown || textStatus || jqXHR.statusText || 'error';
        callback(null, textStatus, jqXHR, error);
      }
    });
		
    request.done(function(response, textStatus, jqXHR){
      
      if (callback) {
        callback(response, textStatus, jqXHR);
      }
      
    });
 
    return request;
  }
  
  /**
   * 
   * 
   * @param {String}  earliest 
   * @param {function} callback the callback function
   * @return Array
   */
  self.resourceRestRequestHandlerGetResponsesGET = function(earliest, callback) {
    var postBody = null;
    var postBinaryBody = null;
    
    // create path and map variables
    var basePath = 'http://localhost:8085';
    // if basePath ends with a /, remove it as path starts with a leading /
    if (basePath.substring(basePath.length-1, basePath.length)=='/') {
    	basePath = basePath.substring(0, basePath.length-1);
    }
    
    var path = basePath + replaceAll(replaceAll("/api/v1.0/responses", "\\{format\\}","json"));

    var queryParams = {};
    var headerParams =  {};
    var formParams =  {};

    
    queryParams.earliest = earliest;
    
    
    

    path += createQueryString(queryParams);

    var options = {type: "GET", async: true, contentType: "application/json", dataType: "json", data: postBody};
    var request = $.ajax(path, options);

    request.fail(function(jqXHR, textStatus, errorThrown){
      if (callback) {
        var error = errorThrown || textStatus || jqXHR.statusText || 'error';
        callback(null, textStatus, jqXHR, error);
      }
    });
		
    request.done(function(response, textStatus, jqXHR){
      
      /**
        * @returns Array
        */
      
      var myResponse = new Array();
      myResponse.constructFromObject(response);
      if (callback) {
        callback(myResponse, textStatus, jqXHR);
      }
      
    });
 
    return request;
  }
  
  

 	function replaceAll (haystack, needle, replace) {
		var result= haystack;
		if (needle !=null && replace!=null) {
			result= haystack.replace(new RegExp(needle, 'g'), replace);
		}
		return result;
	}

 	function createQueryString (queryParams) {
		var queryString ='';
		var i = 0;
		for (var queryParamName in queryParams) {
			if (i==0) {
				queryString += '?' ;
			} else {
				queryString += '&' ;
			}
			
			queryString +=  queryParamName + '=' + encodeURIComponent(queryParams[queryParamName]);
			i++;
		}
		
		return queryString;
	}
}

// export module for Node.js
if (typeof module === 'object' && module.exports) {
  module.exports = RestRequestHandlerApi;
}
