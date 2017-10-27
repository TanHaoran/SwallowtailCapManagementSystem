'use strict';

app
	.controller('ManagerOperateCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$state', function($scope, commonService, modelService, $newLocalStorage, $state) {

		$scope.currentPageNo = 1;
		$scope.pageSize = 16;
		$scope.managerList = [];
		$scope.managerInfo = {};
		$scope.pageList = [];
		$scope.showContent = false; //是否显示内容
		$scope.disableHospital = true; //禁用医院选择
		$scope.lockInput = false;
		$scope.initManagerInfo = {};
		$scope.gegeUser = JSON.parse($newLocalStorage.get('gege_manager'));
		if($scope.gegeUser) {
			//判断是否有权限
			if($scope.$parent.gegePermisson.managerPermisson) {
				$scope.showContent = true;
			} else {
				alert('您还没有此权限，联系管理员开通吧');
				return;
			}
		} else {
			$state.go('access.signin');
		}

		console.log($scope.gegeUser);
		//获取管理员权限列表
		$scope.getPermissionList = function() {
			$scope.permissionList = angular.copy($scope.gegeUser.Admpermissionlist);
			console.log($scope.permissionList);
			$scope.permissionList = _.map($scope.permissionList, function(item) {
				item.checked = false;
				return item;
			});
			console.log($scope.permissionList);
		}
		$scope.getPermissionList();
		//获取科室权限
		$scope.getDepartmentList = function() {
			$scope.depList = [];
			for(var i = 0; i < $scope.gegeUser.Admdepartmentlist.length; i++) {
				var oj = {};
				oj.Name = $scope.gegeUser.Admdepartmentlist[i].DepartmentName;
				oj.DepartmentId = $scope.gegeUser.Admdepartmentlist[i].DepartmentId;
				oj.DepartmentChecked = false;
				$scope.depList.push(oj);
			}
			if($scope.operateState == 'edit') {
				for(var k = 0; k < $scope.depList.length; k++) {
					for(var j = 0; j < $scope.managerInfo.Admdepartmentlist.length; j++) {
						if($scope.managerInfo.Admdepartmentlist[j].DepartmentId == $scope.depList[k].DepartmentId) {
							$scope.depList[k].DepartmentChecked = true;
						}
					}
				}
			}

			console.log($scope.depList);

		}
		//判断是平台还是院内管理员
//		if($scope.gegeUser.Role == 1) {
//			$scope.disableHospital = false;
//		}

		//根据分页获取管理员列表
		$scope.getManagerInfoList = function(page) {
			console.log(JSON.stringify({
				operatorId: $scope.gegeUser.AdmId,
				pageNumber: page,
				pageSize: $scope.pageSize
			}));
			modelService.getAdmin({
				operatorId: $scope.gegeUser.AdmId,
				pageNumber: page,
				pageSize: $scope.pageSize
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.managerList = _.map(commonService.translateServerData(res.body), function(item) {
						item.OpTime = commonService.str2date(item.OperatorTime, 'yyyy-MM-dd');
						return item;
					});
					$scope.pageList = [];
					//获取数据总条数
					$scope.totalNum = parseInt(res.msg);
					//计算页数
					$scope.pages = Math.ceil($scope.totalNum / $scope.pageSize);
					//存储页数
					for(var i = 1; i <= $scope.pages; i++) {
						$scope.pageList.push(i);
					}
				} else {
					$scope.pageList = [];
				}
			}, function(err) {});
		}
		$scope.getManagerInfoList($scope.currentPageNo);

		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.getManagerInfoList(i);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.getManagerInfoList(i);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.getManagerInfoList(i);
		}
		//还原状态
		$scope.initState = function() {
			$('tbody tr').removeClass('tr-success');
			$scope.selectData = false;
		}

		$scope.operateData = function($index, item) {
			if(item.AdmId == $scope.gegeUser.AdmId) {
				return;
			} else {
				$('tbody tr').removeClass('tr-success');
				$('tbody tr:eq(' + $index + ')').addClass('tr-success');
				$scope.selectData = true;
				$scope.managerInfo = angular.copy(item);
				console.log($scope.managerInfo);
			}

		}

		//获取医院列表
		modelService.getHospitalList().then(function(res) {
			console.log(res);
			if(res.code == 0) {
				//处理返回数据
				$scope.hospitalList = res.body;

			} else {
				alert('数据为空');
			}
		}, function(err) {
			alert('网络出错，请刷新重试！');
		});

		//根据医院改变科室
		$scope.changeHospital = function(hospitalId) {
			$scope.lockDep = false;
			//调用获取科室服务
			console.log(hospitalId);
			modelService.getDepByHospId({
				HospitalId: hospitalId
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					$scope.depList = _.map(res.body, function(item) {
						item.DepartmentChecked = false;
						return item;
					});
					$scope.managerInfo.selectAll = true;
					$scope.lockDep = true;
					$scope.selectAll();
				}

			}, function(err) {});

		}

		//全选科室
		$scope.selectAll = function() {
			console.log('all');
			for(var i = 0; i < $scope.depList.length; i++) {
				if($scope.managerInfo.selectAll === true) {
					$scope.depList[i].DepartmentChecked = true;
				} else {
					$scope.depList[i].DepartmentChecked = false;
				}
			}
		}

		//添加管理员
		$scope.addManager = function() {
			$scope.operateState = 'add';
			$scope.managerInfo = angular.copy($scope.initManagerInfo);
			$scope.lockInput = false; //打开输入框
			if($scope.gegeUser.Role == 0 || $scope.gegeUser.Role == 2) {
				if($scope.gegeUser.Role == 2) {
					$scope.managerInfo.HospitalId = $scope.gegeUser.HospitalId;
					$scope.getDepartmentList();
				} else {
					$scope.depList = [];
				}
				$scope.disableHospital = true; //禁用医院
			} else if($scope.gegeUser.Role == 1) {
				$scope.disableHospital = false; //可选医院
			}

			$scope.initState();
			$('#modal_showAudit').modal('show');
			$scope.managerInfo.Admpermissionlist = [];
			$scope.managerInfo.Admdepartmentlist = [];
			$scope.getPermissionList();
		}

		//删除管理员
		$scope.deleteManager = function() {
			if($scope.selectData) {
				if(confirm("确定要删除该账号么？")) {
					modelService.deleteAdmin({
						operatorId: $scope.gegeUser.AdmId,
						AdmId: $scope.managerInfo.AdmId,
					}).then(function(res) {
						if(res.code == 0) {
							alert('删除成功');
							$scope.initState();
							$scope.getManagerInfoList($scope.currentPageNo);
						} else {
							alert('删除失败');
						}
					}, function(err) {
						alert('网络错误！');
					});
				}
			} else {
				alert('请选择要删除的管理员');
			}

		}

		//显示编辑框
		$scope.editManager = function() {
			if($scope.selectData) {
				$scope.operateState = 'edit';
				$scope.lockInput = true; //禁用输入框
				$scope.disableHospital = true; //禁用医院
				console.log($scope.managerInfo);
				$('#modal_showAudit').modal('show');
				if($scope.gegeUser.Role == 1) {
					$scope.changeHospital($scope.managerInfo.HospitalId);
				} else {
					$scope.getDepartmentList();
				}

				if($scope.gegeUser.Role == 1) {
					$scope.lockDep = true;
				} else if($scope.gegeUser.Role == 2) {
					$scope.lockDep = false;
				}
				console.log($scope.depList);
				//				$scope.changeHospital($scope.managerInfo.HospitalId);
				for(var i = 0; i < $scope.permissionList.length; i++) {
					for(var j = 0; j < $scope.managerInfo.Admpermissionlist.length; j++) {
						if($scope.permissionList[i].PermissionId == $scope.managerInfo.Admpermissionlist[j].PermissionId) {
							$scope.permissionList[i].checked = true;
						}
					}
				}
			} else {
				alert('请选择要编辑的管理员');
			}

			console.log($scope.managerInfo);
		}

		//处理权限数据
		$scope.dealPmnAndDep = function() {
			$scope.managerInfo.OperatorId = $scope.gegeUser.AdmId;
			$scope.managerInfo.Admpermissionlist = [];
			$scope.managerInfo.Admdepartmentlist = [];
			for(var j = 0; j < $scope.permissionList.length; j++) {
				if($scope.permissionList[j].checked) {
					var obj = {};
					obj.PermissionId = $scope.permissionList[j].PermissionId;
					obj.PermissionName = $scope.permissionList[j].PermissionName;
					$scope.managerInfo.Admpermissionlist.push(obj);
				}
			}
			//处理选择的科室
			for(var i = 0; i < $scope.depList.length; i++) {
				if($scope.depList[i].DepartmentChecked) {
					var obj = {
						DepartmentId: $scope.depList[i].DepartmentId
					};
					$scope.managerInfo.Admdepartmentlist.push(obj);
				}
			}
		}
		//更新管理员
		$scope.subManagerInfo = function(item) {
			if($scope.operateState == 'add') {
				if($scope.gegeUser.Role == 0) {
					$scope.managerInfo.Role = 1;
				} else if($scope.gegeUser.Role == 1 || $scope.gegeUser.Role == 2) {
					$scope.managerInfo.Role = 2;
				}
				$scope.dealPmnAndDep();
				var data = JSON.stringify({
					model: $scope.managerInfo
				});
				console.log(data);
				modelService.addAdmin(data).then(function(res) {
					if(res.code == 0) {
						alert('添加成功');
						$scope.initState();
						$scope.getManagerInfoList($scope.currentPageNo);
					} else {
						alert('添加失败');
					}
					$('#modal_showAudit').modal('hide');
					$scope.managerInfo = angular.copy($scope.initManagerInfo);
				}, function(err) {
					alert('网络出错，请刷新重试！');
				});
			} else if($scope.operateState == 'edit') {
				$scope.dealPmnAndDep();
				var data = JSON.stringify({
					model: $scope.managerInfo
				});
				console.log(data);
				modelService.updateAdmin(data).then(function(res) {
					if(res.code == 0) {
						alert('更新成功');
						$scope.initState();
						$scope.getManagerInfoList($scope.currentPageNo);
					} else {
						alert('更新失败');
					}
					$('#modal_showAudit').modal('hide');
				}, function(err) {
					alert('网络出错，请刷新重试！');
				});
				$('#modal_showAudit').modal('hide');
			}

		}
		//重置管理员密码
		$scope.restPwd = function() {
			if($scope.selectData) {
				if(confirm("确定要重置密码么？")) {
					console.log(JSON.stringify({
						model: $scope.managerInfo
					}));

					modelService.resetAdminPassword({
						model: $scope.managerInfo
					}).then(function(res) {
						console.log(res);
						if(res.code == 0) {
							alert('密码已被重置为：' + res.body.Password + ',请尽快修改！');
							$scope.initState();
							$scope.getManagerInfoList($scope.currentPageNo);
						} else {
							alert('密码重置失败！');
						}
					}, function(err) {
						alert('网络错误！刷新重试')
					});
				}

			} else {
				alert('请选择要重置密码的管理员');
			}
		}

		//关闭编辑框
		$scope.closeModal = function() {
			$('#modal_showAudit').modal('hide');
		}

		//刷新页面
		$scope.refresh = function() {
			window.location.reload();
		}

	}]);