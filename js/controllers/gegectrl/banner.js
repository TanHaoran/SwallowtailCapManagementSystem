'use strict';

app
	// Flot Chart controller
	.controller('BannerCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$state', function($scope, commonService, modelService, $newLocalStorage, $state) {
		console.log('banner管理');
		$scope.showContent = false;
		$scope.bannerNum = 5;
		$scope.gegeUser = JSON.parse($newLocalStorage.get('gege_manager'));
		if($scope.gegeUser) {
			//判断是否有权限
			if($scope.$parent.gegePermisson.bannerPermisson) {
				$scope.showContent = true;
			} else {
				alert('您还没有相应权限，联系管理员给您开通吧！');
				return;
			}
		} else {
			$state.go('access.signin');
		}

		$scope.getBanner = function() {
			$scope.bannerList=[];
			modelService.getBanner({
				operatorId: $scope.gegeUser.AdmId
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.bannerList = _.map(commonService.translateServerData(res.body), function(item) {
						item.bannerImg = modelService.rootUrl + 'Banner/' + item.BannerUrl;
						item.btnName = '编辑';
						if(item.IsFlag == 0) {
							item.showState = '点击开启';
						} else if(item.IsFlag == 1) {
							item.showState = '点击关闭';
						}

						item.btnState = true;
						return item;
					});

				} else {
					$scope.pageList = [];
				}
			}, function(err) {});
		}
		$scope.getBanner();

		$scope.bannerShowOrNot = function(item) {
			//限制banner至少保留一张
			for(var i = 0; i < $scope.bannerList.length; i++) {
				if($scope.bannerList[i].IsDelete == 0) {
					if($scope.bannerNum == 1) {
						alert('至少需要保留1张banner');
						return;
					} else {
						$scope.bannerNum--;
					}

				}
			}

			if(item.IsDelete == 1) {
				item.IsDelete = 0;
				item.showState = '点击开启';
				$scope.bannerNum--;
			} else if(item.IsDelete == 0) {
				item.IsDelete = 1;
				item.showState = '点击关闭';
				$scope.bannerNum++;
			}
		}

		//显示大图及改变图片
		$scope.showPic = function(item) {
			//编辑状态下放大图片并可以改变图片
			if(!item.btnState) {
				$scope.bannerPic =angular.copy(item);
				$('#modal_showAudit').modal('show');
			}
		}

		//改变图片
		$scope.changefile = function() {
			var selectedfile = document.querySelector('#fileToUpload').files[0];
			if(selectedfile) {
				var fileType = selectedfile.name.toLowerCase().split('.');
				if(fileType[fileType.length - 1] == 'gif' || fileType[fileType.length - 1] == 'jpg' || fileType[fileType.length - 1] == 'bmp' || fileType[fileType.length - 1] == 'png' || fileType[fileType.length - 1] == 'jpeg') {
					if(selectedfile.size > 1024 * 1024 * 2) {
						alert('请选择2M以内的图片');
						return;
					} else {
						$scope.bannerPic.bannerImg = window.URL.createObjectURL(selectedfile);
						$scope.$apply();
					}
				} else {
					alert('请选择正确格式的图片');
					return;
				}
			}

		}

		//更改图片并提交
		$scope.changeBannerPic = function() {
			var fd = new FormData();
			var file = document.querySelector('#fileToUpload').files[0];
			fd.append('fileToUpload', file);

			if(file == null || file == '' || file == undefined) {

			} else {
				$.ajax({
					url: modelService.rootUrl + 'BannerHandler.ashx',
					type: "POST",
					async: false,
					cache: false,
					processData: false,
					contentType: false,
					data: fd,
					success: function(res) {
						console.log(res);
						var res = JSON.parse(res);
						if(res.code == 0) {
							$scope.bannerPic.BannerUrl = res.body.Filename;
							$scope.bannerPic.operatorId=$scope.gegeUser.AdmId;
							console.log({
								model: $scope.bannerPic
							});
							modelService.updateBanner({
								model: $scope.bannerPic
							}).then(function(result) {
								console.log(result);
								if(result.code == 0) {
									//处理返回数据
									alert('图片更新成功');
									$('#modal_showAudit').modal('hide');
									$scope.getBanner();
								} else {
									alert('图片更新失败');
								}

							}, function(err) {});
						}
					},
					error: function(err) {
						console.log(err);
					}
				});
			}
			
		}

		//关闭图片modal
		$scope.closeModal = function() {
			$('#modal_showAudit').modal('hide');
		}

		//编辑或显示
		$scope.editOrShow = function(item) {
			if(item.btnName == '编辑') {
				item.btnName = '保存';
				item.btnState = false;
			} else {
				//更新banner信息
				item.operatorId=$scope.gegeUser.AdmId;
				console.log(JSON.stringify({
					model: item
				}));
				modelService.updateBanner({
					model: item
				}).then(function(res) {
					console.log(res);
					if(res.code == 0) {
						//处理返回数据
						alert('更新成功');
						$scope.getBanner();
					} else {
						alert('更新失败');
					}
					item.btnName = '编辑';
					item.btnState = true;
				}, function(err) {});
			}
		}

		//是否包含链接处理
		$scope.onOroffUrl = function(item) {
			console.log(item.IsFlag);
			if(item.IsFlag == 0) {
				item.BannerToUrl = '';
			}
		}

	}]);