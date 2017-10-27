'use strict';

app
	.controller('UpdateAppCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$state', function($scope, commonService, modelService, $newLocalStorage, $state) {
		console.log('更新管理');
		$scope.appInfo = {};
		console.log(modelService.rootUrl);
		$scope.subFlag = true;
		$scope.fileCompleted = false;
		$scope.progressLoad = 0;
		$scope.btnName = '发布更新';
		$scope.showContent = false;
		$scope.gegeUser = JSON.parse($newLocalStorage.get('gege_manager'));
		if($scope.gegeUser) {
			//判断是否有权限
			if($scope.$parent.gegePermisson.appPermisson) {
				$scope.showContent = true;
			} else {
				alert('您还没有相应权限，联系管理员给您开通吧！');
				return;
			}
		} else {
			$state.go('access.signin');
		}

		$scope.subAppInfo = function() {
			if($scope.subFlag) {
				$scope.subFlag = false;
				var fd = new FormData();
				var file = document.querySelector('input[type=file]').files[0];
				fd.append('fileToUpload', file);
				if(file == null || file == '' || file == undefined) {
					alert('请上传app文件');
					return;
				} else {
					console.log(fd);
					$scope.fileCompleted = true;
					$scope.btnName = '提交中...';
					//					$.ajax({
					//						url: modelService.rootUrl + 'APKHandler.ashx',
					//						type: "POST",
					//						async: false,
					//						cache: false,
					//						processData: false,
					//						contentType: false,
					//						data: fd,
					//						success: function(res) {
					//							console.log(res);
					//							$scope.subFlag = true;
					//							$scope.btnName = '发布更新';
					//						},
					//						error: function(error) {
					//							console.log(error);
					//						}
					//					});
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function() {
						if(xhr.readyState == 4 && xhr.status == 200) {
							//							alert(xhr.responseText);
							console.log(xhr.responseText);
							alert('版本更新成功！');
							$scope.subFlag = true;
							$scope.btnName = '发布更新';
						}
					}
					xhr.upload.onprogress = function(evt) {
						//侦查附件上传情况  
						//通过事件对象侦查  
						//该匿名函数表达式大概0.05-0.1秒执行一次  
						//console.log(evt);  
						//console.log(evt.loaded);  //已经上传大小情况  
						//evt.total; 附件总大小  
						var loaded = evt.loaded;
						var tot = evt.total;
						var per = Math.floor(100 * loaded / tot); //已经上传的百分比  
						var son = document.getElementById('uploadProgress');
						son.innerHTML = per + "%";
						//						son.style.width = per + "%";
					}
					xhr.open("post", modelService.rootUrl + 'APKHandler.ashx');
					xhr.send(fd);

				}
			}
		}
	}]);