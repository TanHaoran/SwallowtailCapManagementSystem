'use strict';

app
	.controller('NoticeCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$state', function($scope, commonService, modelService, $newLocalStorage, $state) {
		console.log('公告管理');
		$scope.showContent = false;
		$scope.gegeUser = JSON.parse($newLocalStorage.get('gege_manager'));
		if($scope.gegeUser) {
			//判断是否有权限
			if($scope.$parent.gegePermisson.noticePermisson) {
				$scope.showContent = true;
			} else {
				alert('您还没有相应权限，联系管理员给您开通吧！');
				return;
			}
		} else {
			$state.go('access.signin');
		}
		$scope.currentPageNo = 1;
		$scope.pageSize = 16;
		$scope.noticeList = [];
		$scope.noticeDetail = {};
		$scope.pageList = [];
		$scope.initNoticeDetail = {};
		//能够选择的科室为此账号下能管理的科室
		$scope.depList = angular.copy($scope.gegeUser.Admdepartmentlist);
		if($scope.depList.length > 0) {
			$scope.depList = _.map($scope.depList, function(item) {
				item.DepartmentChecked = false;
				return item;
			});
		}
		//初始化富文本编辑器
		$(document).ready(function() {
			$('#summernote').summernote({
				lang: 'zh-CN', // default: 'en-US'
				height: 100,
				placeholder: '在此编辑你的内容',
				toolbar: [
					// [groupName, [list of button]]
					['style', ['bold', 'italic', 'underline', 'clear']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['insert', ['link', 'picture']]
				],
				callbacks: {
					onImageUpload: function(files, editor, $editable) {
						$scope.uploadImg(files);
					}
				}
			});
		});

		$('.form_datetime').datetimepicker({
			minView: "month", //选择日期后，不会再跳转去选择时分秒 
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			todayBtn: 1,
			autoclose: 1,
		});

		//上传图片到服务器并将图片插入到富文本里
		$scope.uploadImg = function(files, editor, $editable) {
			var data = new FormData();
			data.append('fileToUpload', files[0]);
			$.ajax({
				data: data,
				type: "POST",
				url: modelService.rootUrl + 'BannerHandler.ashx', //图片上传出来的url，返回的是图片上传后的路径，http格式  
				cache: false,
				contentType: false,
				processData: false,
				dataType: "json",
				success: function(data) {
					if(data.code == 0) {
						var imgUrl = modelService.rootUrl + 'Banner/' + data.body.Filename;
						$('#summernote').summernote('insertImage', imgUrl);
					}else{
						alert('上传图片失败');
					}

				},
				error: function() {
					alert("上传图片失败");
				}
			});
		}

		//根据分页获取公告列表
		$scope.getNoticeList = function(page) {
			modelService.getNoticeList({
				operatorId: $scope.gegeUser.AdmId,
				pageNumber: page,
				pageSize: $scope.pageSize,
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.noticeList = _.map(commonService.translateServerData(res.body), function(item) {
						item.NoticeTimeweb = commonService.str2date(item.NoticeTime, 'yyyy-MM-dd');
						item.OperatorTimeweb = commonService.str2date(item.OperatorTime, 'yyyy-MM-dd');
						if(item.Type == 0) {
							item.noticeType = '平台';
						} else if(item.Type == 1) {
							item.noticeType = '医院';
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
					$scope.pageList = [];
				}
			}, function(err) {});
		}
		$scope.getNoticeList($scope.currentPageNo);

		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.getNoticeList(i);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.getNoticeList(i);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.getNoticeList(i);
		}

		$scope.initState = function() {
			$('tbody tr').removeClass('tr-success');
			$scope.selectData = false;
			$('#summernote').summernote('code', '');
		}

		$scope.operateData = function($index, item) {
			console.log($index);
			$('tbody tr').removeClass('tr-success');
			$('tbody tr:eq(' + $index + ')').addClass('tr-success');
			$scope.selectData = true;
			$scope.noticeDetail = item;
		}

		//添加公告
		$scope.addNotice = function() {
			$scope.operateState = 'add';
			$scope.initState();
			$('#modal_showAudit').modal('show');
			$scope.noticeDetail = angular.copy($scope.initNoticeDetail);

		}

		//删除公告
		//		$scope.deleteNotice = function() {
		//			$('#modal_showAudit').modal('show');
		//			$scope.noticeDetail = angular.copy($scope.initNoticeDetail);
		//
		//		}

		//处理选择的科室
		$scope.dealSelectDep = function() {
			$scope.noticeDetail.departmentlist = [];
			//处理选择的科室
			for(var i = 0; i < $scope.depList.length; i++) {
				if($scope.depList[i].DepartmentChecked) {
					var obj = {
						DepartmentId: $scope.depList[i].DepartmentId
					};
					$scope.noticeDetail.departmentlist.push(obj);
				}
			}
		}

		//显示公告
		$scope.editNotice = function() {
			$scope.operateState = 'edit';
			if($scope.selectData) {
				var noticeContent = $scope.noticeDetail.Content;
				$('#summernote').summernote('code', noticeContent);
				$('#modal_showAudit').modal('show');
			} else {
				alert('请选择要编辑的公告');
			}

			console.log($scope.noticeDetail);
		}
		//更新公告信息
		$scope.subNotice = function(item) {
			$scope.noticeDetail.OperatorId = $scope.gegeUser.AdmId;
			if($scope.gegeUser.Role == 0 || $scope.gegeUser.Role == 1) {
				//系统管理员发布的公告类型为平台
				$scope.noticeDetail.Type = 0;
			} else {
				//院内管理员发布的公告类型为医院
				$scope.noticeDetail.Type = 1;
			}
			var content = $('#summernote').summernote('code');
			$scope.noticeDetail.Content = content;
			$scope.noticeDetail.HospitalId = $scope.gegeUser.HospitalId;
			$scope.noticeDetail.HospitalName = $scope.gegeUser.HospitalName;
			//处理选择接收公告的科室
			$scope.dealSelectDep();
			console.log($scope.noticeDetail);
			var fd = new FormData();
			var file = document.querySelector('#fileToUpload').files[0];
			fd.append('fileToUpload', file);
			if($scope.operateState == 'add') {
				console.log(JSON.stringify({
					model: $scope.noticeDetail
				}));
				if(file == null || file == '' || file == undefined) {
					modelService.addNoticeList({
						model: $scope.noticeDetail
					}).then(function(result) {
						if(result.code == 0) {
							alert('添加成功');
							$scope.initState();
							$scope.getNoticeList($scope.currentPageNo);
							$('#modal_showAudit').modal('hide');
							$scope.noticeDetail = {};
						} else {
							alert('添加失败');
						}
					}, function(error) {
						console.log(error);
					});
				} else {
					$.ajax({
						url: modelService.rootUrl + 'NoticeHandler.ashx',
						type: "POST",
						async: false,
						cache: false,
						processData: false,
						contentType: false,
						data: fd,
						success: function(res) {
							$scope.noticeDetail.Attachment = res;
							modelService.addNoticeList({
								model: $scope.noticeDetail
							}).then(function(result) {
								if(result.code == 0) {
									alert('添加成功');
									$scope.initState();
									$scope.getNoticeList($scope.currentPageNo);
									$('#modal_showAudit').modal('hide');
									$scope.noticeDetail = {};
								} else {
									alert('添加失败');
								}

							}, function(error) {
								console.log(error);
								alert('网络故障，请刷新重试!');
							});
						},
						error: function(err) {
							console.log(err);
						}
					});
				}

			} else if($scope.operateState == 'edit') {
				if(file == null || file == '' || file == undefined) {
					console.log(JSON.stringify({
						model: $scope.noticeDetail
					}));
					modelService.updateNoticeList({
						model: $scope.noticeDetail
					}).then(function(result) {
						if(result.code == 0) {
							alert('更新成功！');
							$scope.initState();
							$scope.getNoticeList($scope.currentPageNo);
						} else {
							alert('更新失败');
						}
						$('#modal_showAudit').modal('hide');
						$scope.noticeDetail = {};
					}, function(error) {
						console.log(error);
					});
				} else {
					$.ajax({
						url: modelService.rootUrl + 'NoticeHandler.ashx',
						type: "POST",
						async: false,
						cache: false,
						processData: false,
						contentType: false,
						data: fd,
						success: function(res) {
							$scope.noticeDetail.Attachment = res;
							modelService.updateNoticeList({
								model: $scope.noticeDetail
							}).then(function(result) {
								if(result.code == 0) {
									alert('更新成功');
									$scope.initState();
									$scope.getNoticeList($scope.currentPageNo);
								} else {
									alert('更新失败');
								}
								$('#modal_showAudit').modal('hide');
								$scope.noticeDetail = {};
							}, function(error) {
								console.log(error);
							});
						},
						error: function(err) {
							console.log(err);
						}
					});
				}

			}

		}
		//关闭公告框
		$scope.closeModal = function() {
			$('#modal_showAudit').modal('hide');
		}

		//刷新页面
		$scope.refresh = function() {
			window.location.reload();
		}

	}]);