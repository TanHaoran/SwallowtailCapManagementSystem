'use strict';

app
	// Flot Chart controller
	.controller('DepartmentInfoCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$state', function($scope, commonService, modelService, $newLocalStorage, $state) {
		console.log('科室信息管理');
		$scope.showContent = false;
		$scope.gegeUser = JSON.parse($newLocalStorage.get('gege_manager'));
		if($scope.gegeUser) {
			//判断是否有权限
			if($scope.$parent.gegePermisson.departmentPermisson) {
				$scope.showContent = true;
			} else {
				alert('您还没有相应权限，联系管理员给您开通吧！');
				return;
			}
		} else {
			$state.go('access.signin');
		}

		$scope.hospitalList = []; //医院选择列表
		$scope.hospitalLists = []; //避免搜索的值被添加科室选中医院的值覆盖
		$scope.currentPageNo = 1; //第一页
		$scope.pageSize = 16; //设置每页16条
		$scope.pageList = []; //分页
		$scope.showSelectHospital = true; //选中数据显示编辑
		$scope.UpDepartmentState = false; //上级科室编辑状态
		$scope.searchOption = {}; //搜索条件
		$scope.initDepatmentInfo = {
			DisplayOrder: 0,
			HospitalName: '',
			Name: '',
			Contact: '',
			Phone: '',
			OperatorId: ''
		};
		modelService.getHospitalList().then(function(res) {
			console.log(res);
			if(res.code == 0) {
				//处理返回数据
				$scope.hospitalList = res.body;
				$scope.hospitalLists = angular.copy(res.body);
			} else {
				alert('数据为空');
			}
		}, function(err) {
			alert('网络出错，请刷新重试！');
		});
		$scope.changehp = function(a) {
			console.log($scope.searchOption);
			$scope.searchOption=a;
			console.log(a);
		}

		//根据医院搜索
		$scope.searchByHospital = function(page) {
			console.log($scope.searchOption);
			modelService.getDepByHospId({
				operatorId: $scope.gegeUser.AdmId,
				HospitalId: $scope.searchOption.HospitalId,
				pageNumber: page,
				pageSize: $scope.pageSize
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.departmentInfoList = _.map(commonService.translateServerData(res.body), function(item) {
						(item.DisplayOrder == 1) ? item.DisplayOrderName = "是": item.DisplayOrderName = "否";
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
					alert('数据为空');
					$scope.pageList = [];
				}
			}, function(err) {});
		}

		//根据分页获取科室列表
		$scope.getAllDepartmentList = function(page) {
			modelService.getAllDepartmentList({
				operatorId: $scope.gegeUser.AdmId,
				pageNumber: page,
				pageSize: $scope.pageSize
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.departmentInfoList = _.map(commonService.translateServerData(res.body), function(item) {
						(item.DisplayOrder == 1) ? item.DisplayOrderName = "是": item.DisplayOrderName = "否";
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
					alert('数据为空');
					$scope.pageList = [];
				}
			}, function(err) {});
		}
		$scope.getAllDepartmentList($scope.currentPageNo);

		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.getAllDepartmentList(i);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.getAllDepartmentList(i);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.getAllDepartmentList(i);
		}

		//还原状态
		$scope.initState = function() {
			$('tbody tr').removeClass('tr-success');
			$scope.selectData = false;
		}

		//选中行
		$scope.operateData = function($index, item) {
			console.log($index);
			$('tbody tr').removeClass('tr-success');
			$('tbody tr:eq(' + $index + ')').addClass('tr-success');
			$scope.selectData = true;
			$scope.departmentInfoDetail = item;
			console.log($scope.departmentInfoDetail);
		}

		//添加科室
		$scope.addDepartmentInfo = function() {
			$scope.operateState = 'add';
			$scope.showSelectHospital = true; //显示医院选择
			$scope.initState();
			$('#modal_showAudit').modal('show');
			$scope.departmentInfoDetail = angular.copy($scope.initDepatmentInfo);
		}

		//删除科室
		$scope.deleteDepartmentInfo = function() {
			if($scope.selectData) {
				if(confirm("确定要删除此科室么？")) {
					var data = {
						operatorId: $scope.gegeUser.AdmId,
						DepartmentId: $scope.departmentInfoDetail.DepartmentId
					};
					modelService.deleteDepatmentInfo(data).then(function(res) {
						if(res.code == 0) {
							alert('删除成功');
							$scope.initState();
							$scope.getAllDepartmentList($scope.currentPageNo);
						} else {
							alert('删除失败');
						}
					}, function(err) {
						alert('网络出错，请刷新重试！');
					});
				}
			}
			$scope.departmentInfoDetail = angular.copy($scope.initDepatmentInfo);

		}

		//编辑审核框
		$scope.editDepartmentInfo = function() {
			$scope.operateState = 'edit';
			$scope.showSelectHospital = false; //关闭医院选择
			if($scope.selectData) {
				$('#modal_showAudit').modal('show');
			} else {
				alert('请选择要编辑的科室');
			}

			console.log($scope.departmentInfoDetail);
		}

		//上级科室编辑状态更改
		$scope.onOroffUpDepartment = function() {
			if($scope.UpDepartmentState) {
				$scope.departmentInfoDetail.UpDepartment = '';
			}
		}

		//更新科室信息
		$scope.subDepartmentInfo = function() {
			$scope.departmentInfoDetail.OperatorId = $scope.gegeUser.AdmId;
			if($scope.operateState == 'add') {
				var data = JSON.stringify({
					model: $scope.departmentInfoDetail
				});
				console.log(data);
				modelService.addDepatmentInfo(data).then(function(res) {
					console.log(res);
					if(res.code == 0) {
						alert('添加成功');
						$scope.initState();
						$scope.getAllDepartmentList($scope.currentPageNo);
					} else {
						alert('添加失败');
					}
					$('#modal_showAudit').modal('hide');
					$scope.departmentInfoDetail = angular.copy($scope.initDepatmentInfo);
				}, function(err) {
					alert('网络出错，请刷新重试！');
				});
			} else if($scope.operateState == 'edit') {
				console.log(JSON.stringify({
					model: $scope.departmentInfoDetail
				}));
				modelService.updateDepatmentInfo({
					model: $scope.departmentInfoDetail
				}).then(function(res) {
					if(res.code == 0) {
						alert('更新成功');
						$scope.initState();
						$scope.getAllDepartmentList($scope.currentPageNo);
					} else {
						alert('更新失败');
					}
					$('#modal_showAudit').modal('hide');
					$scope.departmentInfoDetail = angular.copy($scope.initDepatmentInfo);
				}, function(err) {
					alert('网络出错，请刷新重试！');
				});

			}
		}
		//关闭审核框
		$scope.closeModal = function() {
			$('#modal_showAudit').modal('hide');
		}

		//刷新页面
		$scope.refresh = function() {
			window.location.reload();
		}

	}]);