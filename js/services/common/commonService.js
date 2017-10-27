'use strict';

 angular.module('commonService', []).service('commonService', function () {  
        return {
			getHttpRequestConfig: function(method, data, url) {
				var requestConfig = {};
				requestConfig.method = method;
				requestConfig.cache=false;
				if (data) {
					if (method === 'get') {
						url += '?';
						for (var key in data) {
							url += key + '=' + data[key] + '&';
						}

						url = url.substring(0, url.length - 1);


					} else if (method === 'post') {
						requestConfig.data = data;
					}
				}

				requestConfig.url = url;

				return requestConfig;
			},
			translateServerData: function(data) {
				if (_.isObject(data)) {
					return data;
				} else {
					return JSON.parse(data);
				}
			},
			dateFormat: function(date) {
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDay();
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var seconds = date.getSeconds();
				return [year, '/', month, '/', day, ' ', hours, ': ', minutes, ': ', seconds].join('');
			},
			str2date: function(time, format) {
				var t = new Date(parseInt(time.replace("\/Date(", "").replace("+0800)\/", "")));
				var tf = function(i) {
					return (i < 10 ? '0' : '') + i
				};

				return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
					switch (a) {
						case 'yyyy':
							return tf(t.getFullYear());
							break;
						case 'MM':
							return tf(t.getMonth() + 1);
							break;
						case 'mm':
							return tf(t.getMinutes());
							break;
						case 'dd':
							return tf(t.getDate());
							break;
						case 'HH':
							return tf(t.getHours());
							break;
						case 'ss':
							return tf(t.getSeconds());
							break;
					}
				});
			},
			date2str: function(str) {
				var dt = new Date();
				if (str !== '')
					dt = new Date(str.replace(new RegExp('-', 'g'), "/"));
				return "\/Date(" + dt.getTime() + "+0800)\/"
			}
		}
    }); 

