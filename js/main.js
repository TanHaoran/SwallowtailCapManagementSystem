'use strict';

/* Controllers */

angular.module('app')
	.controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', '$state', '$newLocalStorage', '$rootScope',
		function($scope, $translate, $localStorage, $window, $state, $newLocalStorage, $rootScope) {
			// add 'ie' classes to html
			var isIE = !!navigator.userAgent.match(/MSIE/i);
			isIE && angular.element($window.document.body).addClass('ie');
			isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

			// config
			$scope.app = {
				name: '燕尾帽',
				version: '0.01',
				// for chart colors
				color: {
					primary: '#7266ba',
					info: '#23b7e5',
					success: '#27c24c',
					warning: '#fad733',
					danger: '#f05050',
					light: '#e8eff0',
					dark: '#3a3f51',
					black: '#1c2b36'
				},
				settings: {
					themeID: 1,
					navbarHeaderColor: 'bg-black',
					navbarCollapseColor: 'bg-white-only',
					asideColor: 'bg-black',
					headerFixed: true,
					asideFixed: false,
					asideFolded: false,
					asideDock: false,
					container: false
				}
			}
			//禁用右键
			document.oncontextmenu=function () {
				return false;
			}

			$scope.gegePermisson = {
				'nurseCertificatePermisson': false,
				'nurseLiscencePermisson': false,
				'bannerPermisson': false,
				'noticePermisson': false,
				'departmentPermisson': false,
				'nurseManagePermisson': false,
				'hospitalManagePermisson': false,
				'appPermisson': false,
				'managerPermisson': false
			};

			//获取登录信息
			$scope.gegeManager = JSON.parse($newLocalStorage.get('gege_manager'));
			if($scope.gegeManager) {
				for(var i = 0; i < $scope.gegeManager.Admpermissionlist.length; i++) {
					if($scope.gegeManager.Admpermissionlist[i].PermissionId == '0000000001') {
						$scope.gegePermisson.managerPermisson = true;  //管理员权限
					}
					if($scope.gegeManager.Admpermissionlist[i].PermissionId == '0000000009') {
						$scope.gegePermisson.nurseLiscencePermisson = true;
						$scope.gegePermisson.nurseCertificatePermisson = true;
					}
					if($scope.gegeManager.Admpermissionlist[i].PermissionId == '0000000005') {
						$scope.gegePermisson.bannerPermisson = true;  //banner权限
					}
					if($scope.gegeManager.Admpermissionlist[i].PermissionId == '0000000003') {
						$scope.gegePermisson.hospitalManagePermisson = true;  //医院权限
					}
					if($scope.gegeManager.Admpermissionlist[i].PermissionId == '0000000004') {
						$scope.gegePermisson.departmentPermisson = true;  //科室权限
					}
					if($scope.gegeManager.Admpermissionlist[i].PermissionId == '0000000006') {
						$scope.gegePermisson.noticePermisson = true;  //公告权限
					}
					if($scope.gegeManager.Admpermissionlist[i].PermissionId == '0000000007') {
						$scope.gegePermisson.appPermisson = true;   //应用更新权限
					}
					if($scope.gegeManager.Admpermissionlist[i].PermissionId == '0000000002') {
						$scope.gegePermisson.nurseManagePermisson = true;  //护士管理权限
					}
				}
				console.log($scope.gegePermisson);
			} else {
				$scope.gegeManager = {
					Name: ''
				};
				$state.go('access.signin');
			}
			$scope.logout = function() {
				$newLocalStorage.remove('gege_manager');
				$scope.gegeManager={};
				$scope.gegePermisson = {
					'nurseCertificatePermisson': false,
					'nurseLiscencePermisson': false,
					'bannerPermisson': false,
					'noticePermisson': false,
					'departmentPermisson': false,
					'nurseManagePermisson': false,
					'hospitalManagePermisson': false,
					'appPermisson': false,
					'managerPermisson': false
				};
				$state.go('access.signin');
			}
			$scope.changePwd=function () {
				$state.go('access.changepwd');
			}

			// save settings to local storage
			if(angular.isDefined($localStorage.settings)) {
				$scope.app.settings = $localStorage.settings;
			} else {
				$localStorage.settings = $scope.app.settings;
			}
			$scope.$watch('app.settings', function() {
				if($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
					// aside dock and fixed must set the header fixed.
					$scope.app.settings.headerFixed = true;
				}
				// save to local storage
				$localStorage.settings = $scope.app.settings;
			}, true);

			// angular translate
			$scope.lang = {
				isopen: false
			};
			$scope.langs = {
				en: 'English',
				de_DE: 'German',
				it_IT: 'Italian'
			};
			$scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
			$scope.setLang = function(langKey, $event) {
				// set the current lang
				$scope.selectLang = $scope.langs[langKey];
				// You can change the language during runtime
				$translate.use(langKey);
				$scope.lang.isopen = !$scope.lang.isopen;
			};

			function isSmartDevice($window) {
				// Adapted from http://www.detectmobilebrowsers.com
				var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
				// Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
				return(/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
			}

		}
	]);