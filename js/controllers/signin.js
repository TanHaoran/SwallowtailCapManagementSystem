'use strict';

app.controller('SigninFormController', ['$scope', '$http', '$state', 'modelService', '$newLocalStorage', function($scope, $http, $state, modelService, $newLocalStorage) {
	$scope.user = {};
	$scope.authError = null;
	$scope.loginLock = false;
	//判断是否已经登录
	var gegeManager = JSON.parse($newLocalStorage.get('gege_manager'));
	if(gegeManager) {
		$state.go('app.welcome');
		/*
		//超级管理员跳转到管理员操作
		if(gegeManager.Role == 0) {
			$state.go('app.manager-operate');
			//平台管理员跳转到两证认证
		} else if(gegeManager.Role == 1) {
			$state.go('app.nurse-certificate');
			//院内管理员跳转到护士管理
		} else if(gegeManager.Role == 2) {
			$state.go('app.nurse-manage');
		}
		*/
	}

    // enter登录
    $scope.enterEvent = function(e) {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
			$scope.login();
        }
    }

	//登录
	$scope.login = function() {
		if(!$scope.loginLock) {
			$scope.loginLock = true;
			$scope.authError = null;
			var loginData = {
				UserId: $scope.user.userID,
				Password: $scope.user.password
			}
			console.log(JSON.stringify({
				model: loginData
			}));
			modelService.login({
				model: loginData
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					$scope.loginLock = false;
					//存储登录信息
					if(res.body.Status == 2) {
						$newLocalStorage.set('changepwd', JSON.stringify(res.body));
						$state.go('access.changepwd');
					} else {
						$newLocalStorage.set('gege_manager', JSON.stringify(res.body));
						$scope.$parent.gegeManager.Name = res.body.Name;
						//循环判断显示对应权限
						for(var i = 0; i < res.body.Admpermissionlist.length; i++) {
							if(res.body.Admpermissionlist[i].PermissionId == '0000000001') {
								$scope.$parent.gegePermisson.managerPermisson = true;
							}
							if(res.body.Admpermissionlist[i].PermissionId == '0000000009') {
								$scope.$parent.gegePermisson.nurseLiscencePermisson = true;
								$scope.$parent.gegePermisson.nurseCertificatePermisson = true;
							}
							if(res.body.Admpermissionlist[i].PermissionId == '0000000005') {
								$scope.$parent.gegePermisson.bannerPermisson = true;
							}
							if(res.body.Admpermissionlist[i].PermissionId == '0000000003') {
								$scope.$parent.gegePermisson.hospitalManagePermisson = true;
							}
							if(res.body.Admpermissionlist[i].PermissionId == '0000000004') {
								$scope.$parent.gegePermisson.departmentPermisson = true;
							}
							if(res.body.Admpermissionlist[i].PermissionId == '0000000006') {
								$scope.$parent.gegePermisson.noticePermisson = true;
							}
							if(res.body.Admpermissionlist[i].PermissionId == '0000000007') {
								$scope.$parent.gegePermisson.appPermisson = true;
							}
							if(res.body.Admpermissionlist[i].PermissionId == '0000000002') {
								$scope.$parent.gegePermisson.nurseManagePermisson = true;
							}
						}
						$state.go('app.welcome');
						/*
						//超级管理员跳转到管理员操作
						if(res.body.Role == 0) {
							$state.go('app.manager-operate');
						} else if(res.body.Role == 1) {
							//平台管理员跳转到两证认证
							$state.go('app.nurse-certificate');
						} else if(res.body.Role == 2) {
							//院内管理员跳转到护士管理
							$state.go('app.nurse-manage');
						}
						*/
					}

				} else {
					$scope.authError = '用户名或密码错误'
					$scope.loginLock = false;
				}
			}, function(err) {
				console.log(err);
			});
		}

	};
}]);