'use strict';

app
	.controller('NurseCertificateCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$rootScope', function($scope, commonService, modelService, $newLocalStorage, $rootScope) {
		$scope.currentPageNo = 1; //第一页
		$scope.pageSize = 10; //每页10条
		$scope.certificateList = []; //执业证列表
		$scope.certificateDetail = {}; //执业证详情
		$scope.pageList = []; //页数
		$scope.selectData = false; //是否选中一行
		$scope.searchOption = {}; //搜索条件
		$scope.searchState = 'all'; //页面初始显示全部
		$scope.showContent = false;
		console.log('护士执业证');
		$scope.gegeUser = JSON.parse($newLocalStorage.get('gege_manager'));
		if($scope.gegeUser) {
			//判断是否有权限
			if($scope.$parent.gegePermisson.nurseCertificatePermisson) {
				$scope.showContent = true;
			} else {
				alert('您还没有此权限，联系管理员开通吧');
				return;
			}
		} else {
			$state.go('access.signin');
		}

		$scope.getCertificateList = function(page) {
			if($scope.searchState == 'all') {
				var data = {
					operatorId: $scope.gegeUser.AdmId,
					pageNumber: page,
					pageSize: $scope.pageSize,
					CertificateId: '',
					Name: ''
				};
			} else {
				var data = {
					operatorId: $scope.gegeUser.AdmId,
					pageNumber: page,
					pageSize: $scope.pageSize,
					CertificateId: $scope.searchOption.certificateID,
					Name: $scope.searchOption.Name
				};
			}

			//获取审核列表
			modelService.getCertificateList(data).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.certificateList = _.map(commonService.translateServerData(res.body), function(item) {
						item.BirthDateTime = commonService.str2date(item.BirthDate, 'yyyy-MM-dd');
						item.FirstRegisterDateTime = commonService.str2date(item.FirstRegisterDate, 'yyyy-MM-dd');
						item.LastRegisterDateTime = commonService.str2date(item.LastRegisterDate, 'yyyy-MM-dd');
						item.RegisterToDateTime = commonService.str2date(item.RegisterToDate, 'yyyy-MM-dd');
						item.CertificateDateTime = commonService.str2date(item.CertificateDate, 'yyyy-MM-dd');
						item.FirstJobTimeDate = commonService.str2date(item.FirstJobTime, 'yyyy-MM-dd');
						item.Picture1Url = modelService.rootUrl + 'PC/' + item.Picture1;
						item.Picture2Url = modelService.rootUrl + 'PC/' + item.Picture2;
						item.Picture3Url = modelService.rootUrl + 'PC/' + item.Picture3;
						if(item.VerifyStatus == 1) {
							item.auditState = '待审核';
						} else if(item.VerifyStatus == 2) {
							item.auditState = '已拒绝';
						} else if(item.VerifyStatus == 3) {
							item.auditState = '已通过';
						}
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
			}, function(err) {});
		}
		$scope.getCertificateList($scope.currentPageNo);

		$scope.searchByOption = function() {
			$scope.searchState = 'byOption';
			if($scope.searchOption.Name && $scope.searchOption.certificateID) {
				$scope.getCertificateList(1);
			}
		}
		$scope.searchAll = function() {
			$scope.searchState = 'all';
			$scope.getCertificateList(1);
		}

		//提交审核
		$scope.updateAuditStatus = function(status) {
			$scope.certificateDetail.Type = 1;
			if(status == 'ok') {
				//通过审核
				$scope.certificateDetail.VerifyStatus = 3;
				console.log(JSON.stringify({
					model: $scope.certificateDetail
				}));
				modelService.UpdateAuditStatus({
					model: $scope.certificateDetail
				}).then(function(res) {
					console.log(res);
					if(res == 0) {
						alert('审核通过提交成功');
						$('#modal_showAudit').modal('hide');
						$('tbody tr').removeClass('tr-success');
						$scope.selectData = false;
						$scope.certificateDetail = {};
						$scope.getCertificateList($scope.currentPageNo);
					}
				}, function(err) {});
			}
			if(status == 'deny') {
				//拒绝通过
				if($scope.certificateDetail.VerifyView == '' || $scope.certificateDetail.VerifyView == undefined) {
					alert('请输入拒绝的意见');
					return;
				}
				
				$scope.certificateDetail.VerifyStatus = 2;
				console.log(JSON.stringify({
					model: $scope.certificateDetail
				}));
				modelService.UpdateAuditStatus({
					model: $scope.certificateDetail
				}).then(function(res) {
					console.log(res);
					if(res == 0) {
						alert('拒绝通过提交成功');
						$scope.initState();
						$scope.certificateDetail = {};
						$('#modal_showAudit').modal('hide');
						$scope.getCertificateList($scope.currentPageNo);
					}
				}, function(err) {});
			}
		}
		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.getCertificateList(i);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.getCertificateList(i);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.getCertificateList(i);
		}

		//还原状态
		$scope.initState = function() {
			$('tbody tr').removeClass('tr-success');
			$scope.selectData = false;
		}

		//选中行
		$scope.operateData = function($index, item) {
			$('tbody tr').removeClass('tr-success');
			$('tbody tr:eq(' + $index + ')').addClass('tr-success');
			$scope.selectData = true;
			$scope.certificateDetail = angular.copy(item);
		}

		//显示审核框
		$scope.editCertificateDetail = function(item) {
			if($scope.selectData) {
				$('#modal_showAudit').modal('show');
			} else {
				alert('请选中需要审核的证件');
			}

			console.log($scope.certificateDetail);
		}

		//刷新页面
		$scope.refresh = function() {
			window.location.reload();
		}

	}]);