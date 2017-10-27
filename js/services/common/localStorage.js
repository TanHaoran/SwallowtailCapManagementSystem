'use strict';
 angular.module('$newLocalStorage', []).service('$newLocalStorage', function () {  
        var localStorage = window.localStorage;
		return {
			get: function(key) {
				return localStorage.getItem(key);
			},
			set: function(key, value) {
				localStorage.setItem(key, value);
			},
			remove: function(key) {
				localStorage.removeItem(key);
			},
			clear: function() {
				localStorage.clear();
			}
		} 
    });  
