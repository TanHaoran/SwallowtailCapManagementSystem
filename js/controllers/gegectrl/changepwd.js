'use strict';

app
	.controller('ChangePwdCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$state', function($scope, commonService, modelService, $newLocalStorage, $state) {
				console.log('修改密码');
				$scope.lockBtn = false;
				$scope.pwdData = JSON.parse($newLocalStorage.get('changepwd'));
				$scope.subInfo = function() {
					if(!$scope.lockBtn) {
						$scope.lockBtn = true;
						if($scope.newPwd != '' && $scope.newPwd != null && $scope.newPwd != undefined) {
							$scope.pwdData.Password = $scope.newPwd;
							console.log(JSON.stringify({
								model: $scope.pwdData
							}));
							modelService.updateAdmin({
								model: $scope.pwdData
							}).then(function(res) {
									console.log(res);
									if(res.code == 0) {
										$newLocalStorage.remove('changepwd');
										$state.go('access.signin');
									} else {
										alert(res.msg);
									}

								},function(err){
									alert('网络错误！');
								});
							}else{
								alert('新密码不能为空！');
							}
						}
					}
						}]);