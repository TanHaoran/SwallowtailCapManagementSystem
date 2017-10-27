'use strict';
angular.module('modelService', ['commonService', 'interfaceConfig']).service('modelService', function($http, $q, commonService, interfaceConfig) {
	return {
		//服务根地址
		rootUrl:interfaceConfig.BATHURL,
		//获取执业证列表
		getCertificateList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.PRACTIS_AUDIT_PAGING))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//护士资格证
		getLiscenceList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.QUACERT_AUDIT_PAGING))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//审核状态编辑
		UpdateAuditStatus: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.UPDATE_AUDIT_STATUS))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//获取医院信息列表
		getHospitalInfoList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GET_HOSPITAL_INFO))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//添加医院信息
		addHospitalInfo: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.ADD_HOSPITAL_INFO))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//删除医院信息
		deleteHospitalInfo: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.DELETE_HOSPITAL_INFO))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//更新医院信息
		updateHospitalInfo: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.UPDATE_HOPITAL_INFO))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//获取所有科室信息列表
		getAllDepartmentList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GET_ALL_DEPARTMENT))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//添加科室信息
		addDepatmentInfo: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.ADD_DEPARTMENT))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//更新科室信息
		updateDepatmentInfo: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.UPDATE_DEPARTMENT))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//删除科室信息
		deleteDepatmentInfo: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.DELETE_DEPARTMENT))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//获取所有医院及ID
		getHospitalList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GET_HOSPITAL_LIST))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//获取管理员
		getAdmin: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GET_ADMIN))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//添加管理员
		addAdmin: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.ADD_ADMIN))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//更新管理员
		updateAdmin: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.UPDATE_ADMIN))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//根据医院ID获取科室
		getDepByHospId: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GET_DEP_BY_HOSPID))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//删除管理员
		deleteAdmin: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.DELETE_ADMIN))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//获取banner
		getBanner: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GET_BANNER))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//添加banner
		addBanner: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.ADD_BANNER))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//更新banner
		updateBanner: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.UPDATE_BANNER))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//删除banner
		deleteBanner: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.DELETE_BANNER))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//获取公告
		getNoticeList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GET_NOTICE))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//添加公告
		addNoticeList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.ADD_NOTICE))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//修改公告
		updateNoticeList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.UPDATE_NOTICE))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//删除公告
		deleteNoticeList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.DELETE_NOTICE))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//登录
		login: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.SIGNIN))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//获取权限列表
		getPermissionList: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GETPERMISSIONLIST))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//获取管理员权限
		getAdminPermission: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GETADMINPERMISSION))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//重置管理员密码
		resetAdminPassword: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.RESET_ADMIN_PASSWORD))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//获取所有用户（护士）
		getAllNurseInfo: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('get', data, interfaceConfig.GET_ALL_NURSEINFO))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//添加用户（护士）
		addNurse: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.ADDNURSE))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//修改用户（护士）
		updateNurse: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.UPDATE_NURSE_INFO))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		},
		//删除用户（护士）
		deleteNurse: function(data) {
			var defer = $q.defer();
			$http(commonService.getHttpRequestConfig('post', data, interfaceConfig.DELETENURSE))
				.success(function(result) {
					defer.resolve(result);
				})
				.error(function(error) {
					defer.reject(error);
				});
			return defer.promise;
		}




	};
});