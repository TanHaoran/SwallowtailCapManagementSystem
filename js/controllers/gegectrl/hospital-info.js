'use strict';

app
	.controller('HospitalInfoCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$state', function($scope, commonService, modelService, $newLocalStorage, $state) {
		$scope.currentPageNo = 1;
		$scope.pageSize = 16;
		$scope.hospitalInfoList = [];
		$scope.pageList = [];
		$scope.operateState = '';
		$scope.mapclick = 1;
		$scope.showContent = false;
		var map;
		$scope.gegeUser = JSON.parse($newLocalStorage.get('gege_manager'));
		if($scope.gegeUser) {
			//判断是否有权限
			if($scope.$parent.gegePermisson.hospitalManagePermisson) {
				$scope.showContent = true;
			} else {
				alert('您还没有相应权限，联系管理员给您开通吧！');
				return;
			}
		} else {
			$state.go('access.signin');
		}

		$scope.initHospitalInfo = {
			DisplayOrder: 0,
			IsOpenBLSJ: 0,
			IsOpenXF: 0,
			IsOpenPB: 0,
			Contact: '',
			Name: '',
			Grade: '',
			Longitude: '',
			Latitude: '',
			Phone: '',
			OperatorId: ''
		};
		//初始化地图
		$scope.initMap = function() {
			//确保只实例化一次
			if($scope.mapclick == 1) {
				map = new BMap.Map("map-container");
				map.centerAndZoom("西安", 11);
				map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
				map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
				map.addEventListener("click", function(e) {
					map.clearOverlays();
					var point = new BMap.Point(e.point.lng, e.point.lat);
					var marker = new BMap.Marker(point); // 创建标注
					map.addOverlay(marker); // 将标注添加到地图中
					$scope.hospitalInfoDetail.Longitude = e.point.lng;
					$scope.hospitalInfoDetail.Latitude = e.point.lat;
				});
			}
			if($scope.operateState == 'add') {
				//				map.centerAndZoom("西安", 11);
				map.clearOverlays();
			} else if($scope.operateState == 'edit') {
				//					map.centerAndZoom("西安", 11);
				if($scope.hospitalInfoDetail.Longitude && $scope.hospitalInfoDetail.Latitude) {
					var point = new BMap.Point($scope.hospitalInfoDetail.Longitude, $scope.hospitalInfoDetail.Latitude);
					map.centerAndZoom(point);
					map.clearOverlays();
					var marker = new BMap.Marker(point); // 创建标注
					map.addOverlay(marker); // 将标注添加到地图中
				}

			}
			$scope.mapclick++;
		}

		//根据分页获取医院列表
		$scope.getHospitalInfoList = function(page) {
			modelService.getHospitalInfoList({
				operatorId: $scope.gegeUser.AdmId,
				pageNumber: page,
				pageSize: $scope.pageSize
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.hospitalInfoList = _.map(commonService.translateServerData(res.body), function(item) {
						item.OperatorDateTime = commonService.str2date(item.OperatorTime, 'yyyy-MM-dd');
						(item.DisplayOrder == 1) ? item.DisplayOrderName = "是": item.DisplayOrderName = "否";
						(item.IsOpenBLSJ == 1) ? item.IsOpenBLSJName = "是": item.IsOpenBLSJName = "否";
						(item.IsOpenXF == 1) ? item.IsOpenXFName = "是": item.IsOpenXFName = "否";
						(item.IsOpenPB == 1) ? item.IsOpenPBName = "是": item.IsOpenPBName = "否";
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
				}
			}, function(err) {
				alert('网络出错，请刷新重试！');
			});
		}
		$scope.getHospitalInfoList($scope.currentPageNo);

		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.currentPageNo = i;
				$scope.getHospitalInfoList($scope.currentPageNo);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.currentPageNo = i;
				$scope.getHospitalInfoList($scope.currentPageNo);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.currentPageNo = i;
			$scope.getHospitalInfoList($scope.currentPageNo);
		}
		
		//还原状态
		$scope.initState = function() {
			$('tbody tr').removeClass('tr-success');
			$scope.selectData = false;
		}

		$scope.operateData = function($index, item) {
			$('tbody tr').removeClass('tr-success');
			$('tbody tr:eq(' + $index + ')').addClass('tr-success');
			$scope.hospitalInfoDetail = angular.copy(item);
			$scope.selectData = true;
		}

		//添加医院
		$scope.addHospitalInfo = function() {
			$scope.operateState = 'add';
			$scope.initState();
			$('#modal_showAudit').modal('show');
			$scope.hospitalInfoDetail = angular.copy($scope.initHospitalInfo);
			$scope.initMap();

		}

		//删除医院信息
		$scope.deleteHospitalInfo = function() {
			console.log('删除');
			if($scope.selectData) {
				if(confirm("确定要删除该医院么？")) {
					var data = {
						operatorId: $scope.gegeUser.AdmId,
						HospitalId: $scope.hospitalInfoDetail.HospitalId
					};
					modelService.deleteHospitalInfo(data).then(function(res) {
						if(res.code == 0) {
							alert('删除成功');
							$scope.initState();
							$scope.getHospitalInfoList($scope.currentPageNo);
						} else {
							alert('删除失败');
						}
					}, function(err) {
						alert('网络出错，请刷新重试！');
					});
				}
			} else {
				alert('请选择要编辑的医院');
			}

		}

		//显示审核框
		$scope.editHospitalInfo = function() {
			if($scope.selectData) {
				$scope.operateState = 'edit';
				console.log($scope.hospitalInfoDetail);
				$('#modal_showAudit').modal('show');
				$scope.initMap();
			} else {
				alert('请选择要编辑的医院');
			}

		}
		//更新提交医院信息
		$scope.subHospitalInfo = function(item) {
			$scope.hospitalInfoDetail.OperatorId = $scope.gegeUser.AdmId;
			if($scope.operateState == 'add') {
				console.log($scope.hospitalInfoDetail);
				var data = JSON.stringify({
					model: $scope.hospitalInfoDetail
				});
				console.log(data);
				modelService.addHospitalInfo(data).then(function(res) {
					if(res.code == 0) {
						alert('添加成功');
						$scope.initState();
						$scope.getHospitalInfoList($scope.currentPageNo);
					} else {
						alert('添加失败');
					}
					$('#modal_showAudit').modal('hide');
					$scope.hospitalInfoDetail = angular.copy($scope.initHospitalInfo);
				}, function(err) {
					alert('网络出错，请刷新重试！');
				});
			} else if($scope.operateState == 'edit') {
				delete $scope.hospitalInfoDetail.OperatorTime;
				var data = JSON.stringify({
					model: $scope.hospitalInfoDetail
				});
				console.log(data);
				modelService.updateHospitalInfo(data).then(function(res) {
					if(res.code == 0) {
						alert('更新成功');
						$scope.initState();
						$scope.getHospitalInfoList($scope.currentPageNo);
					} else {
						alert('更新失败');
					}
					$('#modal_showAudit').modal('hide');
					$scope.hospitalInfoDetail = angular.copy($scope.initHospitalInfo);
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