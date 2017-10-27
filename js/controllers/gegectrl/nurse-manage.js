'use strict';

app
	.controller('NurseManageCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$state', function($scope, commonService, modelService, $newLocalStorage, $state) {
		console.log('护士管理');

		$scope.currentPageNo = 1;
		$scope.pageSize = 16;
		$scope.nurseInfoList = [];
		$scope.nurseInfo = {};
		$scope.pageList = [];
		$scope.showContent = false;
		$scope.lockHospital = false;
		$scope.initNurseInfo = {
			id: '',
			cellphone: '',
			name: '',
			departmentName: '',
			positions: ''
		};

		$scope.gegeUser = JSON.parse($newLocalStorage.get('gege_manager'));
		if($scope.gegeUser) {
			//判断是否有权限
			if($scope.$parent.gegePermisson.nurseManagePermisson) {
				$scope.showContent = true;
			} else {
				alert('您还没有此权限，联系管理员开通吧');
				return;
			}
		} else {
			$state.go('access.signin');
		}
		//获取所有医院列表
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

		//根据分页获取护士列表
		$scope.getNurseInfoList = function(page) {
			console.log(JSON.stringify({
				operatorId: $scope.gegeUser.AdmId,
				hospitalId: $scope.gegeUser.HospitalId,
				pageNumber: page,
				pageSize: $scope.pageSize
			}));
			modelService.getAllNurseInfo({
				operatorId: $scope.gegeUser.AdmId,
				hospitalId: $scope.gegeUser.HospitalId,
				pageNumber: page,
				pageSize: $scope.pageSize
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.nurseList = res.body;
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
					alert(res.msg);
					$scope.pageList = [];
				}
			}, function(err) {});
		}
		$scope.getNurseInfoList($scope.currentPageNo);

		//根据医院改变科室
		$scope.changeHospital = function(hospitalId) {
			//调用获取科室服务
			console.log(hospitalId);
			$scope.lockHospital = false;
			$scope.depList=[];
			modelService.getDepByHospId({
				HospitalId: hospitalId
			}).then(function(res) {
				if(res.code == 0) {
					$scope.depList = res.body;
					if ($scope.operateState=='edit') {
						$scope.lockHospital = true; //禁用医院
						console.log($scope.lockHospital);
					}
				}

			}, function(err) {});
		}

		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.getNurseInfoList(i);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.getNurseInfoList(i);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.getNurseInfoList(i);
		}
		
		//还原状态
		$scope.initState = function() {
			$('tbody tr').removeClass('tr-success');
			$scope.selectData = false;
		}

		$scope.operateData = function($index, item) {
			console.log($index);
			$('tbody tr').removeClass('tr-success');
			$('tbody tr:eq(' + $index + ')').addClass('tr-success');
			$scope.selectData = true;
			$scope.nurseInfo = angular.copy(item);
			console.log($scope.nurseInfo);
		}
		$scope.changefile = function() {

		}

		//添加用户
		$scope.addNurseInfo = function() {
			$scope.operateState = 'add';
			$scope.initState();
			$scope.lockHospital = false;
			$scope.depList = [];
			$('#modal_showAudit').modal('show');
			$scope.nurseInfo = angular.copy($scope.initNurseInfo);

		}

		//删除用户
		$scope.deleteNurseInfo = function() {
			if($scope.selectData) {
				if(confirm("确定要删除该账号么？")) {
					var data = {
						model: $scope.nurseInfo
					};
					console.log(JSON.stringify(data));
					modelService.deleteNurse(data).then(function(res) {
						if(res.code == 0) {
							alert('删除成功');
							$scope.initState();
							$scope.nurseInfo = angular.copy($scope.initNurseInfo);
							$scope.getNurseInfoList($scope.currentPageNo);
						} else {
							alert('删除失败');
						}
					}, function(err) {
						alert('网络出错，请刷新重试！');
					});
				}
			} else {
				alert('请选择要删除的用户！');
			}
			$scope.nurseInfo = angular.copy($scope.initNurseInfo);

		}

		//显示编辑框
		$scope.editNurseInfo = function() {
			if($scope.selectData) {
				$scope.operateState = 'edit';
				$scope.changeHospital($scope.nurseInfo.hospitalId);
				$('#modal_showAudit').modal('show');
			} else {
				alert('请选择要编辑的科室');
			}

			console.log($scope.nurseInfo);
		}
		//更新用户信息
		$scope.subNurseInfo = function(item) {
			console.log($scope.operateState);
			$scope.nurseInfo.adminId = $scope.gegeUser.AdmId;
			if($scope.operateState == 'add') {
				var data = {
					model: $scope.nurseInfo
				};
				console.log(JSON.stringify(data));
				modelService.addNurse(data).then(function(res) {
					if(res.code == 0) {
						alert('添加新用户成功！');
						$scope.nurseInfo = angular.copy($scope.initNurseInfo);
						$scope.initState();
						$scope.getNurseInfoList($scope.currentPageNo);
						$('#modal_showAudit').modal('hide');
					} else {
						alert('添加失败！');
					}
				}, function(err) {
					alert('网络错误，请刷新重试！');
				});
			} else if($scope.operateState == 'edit') {
				var data = {
					model: $scope.nurseInfo
				};
				console.log(JSON.stringify(data));
				modelService.updateNurse(data).then(function(res) {
					if(res.code == 0) {
						alert('更新成功！');
						$scope.initState();
						$scope.nurseInfo = angular.copy($scope.initNurseInfo);
						$('#modal_showAudit').modal('hide');
					} else {
						alert('更新失败！');
					}
				}, function(err) {
					alert('网络错误，请刷新重试！');
				});
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