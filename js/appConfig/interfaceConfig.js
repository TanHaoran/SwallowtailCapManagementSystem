'use strict';
angular.module('interfaceConfig', []).service('interfaceConfig', function() {
		var srv = 'http://zh.buzzlysoft.com/UserService.svc/';
		var rootsrv = 'http://zh.buzzlysoft.com/';
//	var srv = 'http://zhihu.buzzlysoft.com/UserService.svc/';
//	var rootsrv = 'http://zhihu.buzzlysoft.com/';
	return {
		BATHURL: rootsrv, //根地址
		PRACTIS_AUDIT_PAGING: srv + 'GetPCInfo', //护士执业证
		QUACERT_AUDIT_PAGING: srv + 'GetQCInfo', //护士资格证
		UPDATE_AUDIT_STATUS: srv + 'UpdateAuditStatus', //更新审核状态
		GET_HOSPITAL_INFO: srv + 'GetHospitalAll', //获取医院信息
		ADD_HOSPITAL_INFO: srv + 'AddHospital', //添加医院信息
		DELETE_HOSPITAL_INFO: srv + 'DeleteHospital', //删除医院信息
		UPDATE_HOPITAL_INFO: srv + 'UpdateHospital', //更新医院信息
		GET_ALL_DEPARTMENT: srv + 'GetDepartmentAll', //根据医院获取所有科室列表
		ADD_DEPARTMENT: srv + 'AddDepartment', //添加科室
		UPDATE_DEPARTMENT: srv + 'UpdateDepartment', //更新科室
		DELETE_DEPARTMENT: srv + 'DeleteDepartment', //删除科室
		GET_HOSPITAL_LIST: srv + 'GetHospitalNameAll', //获取所有医院名字ID
		GET_ADMIN: srv + 'GetAdministrator', //获取管理员
		ADD_ADMIN: srv + 'AddAdministrator', //添加管理员
		UPDATE_ADMIN: srv + 'UpdateAdministrator', //更新管理员
		DELETE_ADMIN: srv + 'DeleteAdministrator', //删除管理员
		ADD_BANNER: srv + 'AddBanner', //添加banner
		UPDATE_BANNER: srv + 'UpdateBanner', //更新banner
		DELETE_BANNER: srv + 'DeleteBanner', //删除banner
		GET_BANNER: srv + 'GetAdminBanner', //获取banner
		ADD_NOTICE: srv + 'AddNotice', //添加公告
		DELETE_NOTICE: srv + 'UpdateDelNotice', //删除公告
		UPDATE_NOTICE: srv + 'UpdateNotice', //更新公告
		GET_NOTICE: srv + 'GetNoticeAll', //获取公告
		GET_DEP_BY_HOSPID: srv + 'GetDepartmentByHospitalId', //根据医院id查找科室
		SIGNIN: srv + 'ManagementLogin', //登录
		GETPERMISSIONLIST: srv + 'GetPermissionList', //获取权限列表
		GETADMINPERMISSION: srv + 'GetAdminPermission', //获取管理员权限
		RESET_ADMIN_PASSWORD: srv + 'ResetAdminPassword', //重置管理员密码
		GET_ALL_NURSEINFO: srv + 'GetAllNurseInfo', //获取所有护士列表
		ADDNURSE: srv + 'AddNurse', //添加护士
		UPDATE_NURSE_INFO: srv + 'UpdateNurse', //修改护士
		DELETENURSE: srv + 'DeleteNurse', //删除护士
	};
});