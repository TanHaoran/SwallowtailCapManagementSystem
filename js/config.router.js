'use strict';

/**
 * Config for the router
 */
angular.module('app')
	.run(
		['$rootScope', '$state', '$stateParams',
			function($rootScope, $state, $stateParams) {
				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;
			}
		]
	)
	.config(
		['$stateProvider', '$urlRouterProvider',
			function($stateProvider, $urlRouterProvider) {

				$urlRouterProvider
					.otherwise('access/signin');
				$stateProvider
					.state('app', {
						abstract: true,
						url: '/app',
						templateUrl: 'tpl/app.html'
					})
					.state('app.dashboard-v1', {
						url: '/dashboard-v1',
						templateUrl: 'tpl/app_dashboard_v1.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/chart.js']);
								}
							]
						}
					})
					//从业资格证
					.state('app.nurse-certificate', {
						url: '/nurse-certificate',
						templateUrl: 'tpl/credentialView/app_nurse_certificate.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/credential/nurse_certificate.js']);
								}
							]
						}
					})
					//执业证
					.state('app.nurse-liscence', {
						url: '/nurse-liscence',
						templateUrl: 'tpl/credentialView/app_nurse_liscence.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/credential/nurse_liscence.js']);
								}
							]
						}
					})
					//系统消息发布
					.state('app.system-news-publish', {
						url: '/system-news-publish',
						templateUrl: 'tpl/gegeView/app_system_news_publish.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/system-news-publish.js']);
								}
							]
						}
					})
					//Banner管理
					.state('app.banner', {
						url: '/banner',
						templateUrl: 'tpl/gegeView/app_banner.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/banner.js']);
								}
							]
						}
					})
					//公告管理
					.state('app.notice-publish', {
						url: '/notice-publish',
						templateUrl: 'tpl/gegeView/app_notice_publish.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/notice.js']);
								}
							]
						}
					})
					//更新管理
					.state('app.update-app', {
						url: '/update-app',
						templateUrl: 'tpl/gegeView/app_update_app.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/update-app.js']);
								}
							]
						}
					})
					//医院信息
					.state('app.hospital-info', {
						url: '/hospital-info',
						templateUrl: 'tpl/gegeView/app_hospital_info.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/hospital-info.js']);
								}
							]
						}
					})
					//科室管理
					.state('app.department-info', {
						url: '/department-info',
						templateUrl: 'tpl/gegeView/app_department_info.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/department-info.js']);
								}
							]
						}
					})
					//护士管理
					.state('app.nurse-manage', {
						url: '/nurse-manage',
						templateUrl: 'tpl/gegeView/app_nurse_manage.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/nurse-manage.js']);
								}
							]
						}
					})
					//反馈处理
					.state('app.feedback', {
						url: '/feedback',
						templateUrl: 'tpl/gegeView/app_feedback.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/feedback.js']);
								}
							]
						}
					})
					//管理员管理
					.state('app.manager-operate', {
						url: '/manager-operate',
						templateUrl: 'tpl/gegeView/app_manager_operate.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/manager-operate.js']);
								}
							]
						}
					})
					//欢迎页
					.state('app.welcome', {
						url: '/welcome',
						templateUrl: 'tpl/gegeView/app_welcome.html',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load(['js/controllers/gegectrl/welcome.js']);
								}
							]
						}
					})
					// others
					//锁屏
					.state('lockme', {
						url: '/lockme',
						templateUrl: 'tpl/page_lockme.html'
					})
					.state('access', {
						url: '/access',
						template: '<div ui-view class="fade-in-right-big smooth"></div>'
					})
					//登录
					.state('access.signin', {
						url: '/signin',
						templateUrl: 'tpl/page_signin.html',
						resolve: {
							deps: ['uiLoad',
								function(uiLoad) {
									return uiLoad.load(['js/controllers/signin.js']);
								}
							]
						}
					})
					//修改密码
					.state('access.changepwd', {
						url: '/changepwd',
						templateUrl: 'tpl/gegeView/app_changepwd.html',
						resolve: {
							deps: ['uiLoad',
								function(uiLoad) {
									return uiLoad.load(['js/controllers/gegectrl/changepwd.js']);
								}
							]
						}
					})
					//注册
					.state('access.signup', {
						url: '/signup',
						templateUrl: 'tpl/page_signup.html',
						resolve: {
							deps: ['uiLoad',
								function(uiLoad) {
									return uiLoad.load(['js/controllers/signup.js']);
								}
							]
						}
					})
					//忘记密码
					.state('access.forgotpwd', {
						url: '/forgotpwd',
						templateUrl: 'tpl/page_forgotpwd.html'
					})
					//404页面
					.state('access.404', {
						url: '/404',
						templateUrl: 'tpl/page_404.html'
					})

					.state('music', {
						url: '/music',
						templateUrl: 'tpl/music.html',
						controller: 'MusicCtrl',
						resolve: {
							deps: ['$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad.load([
										'com.2fdevs.videogular',
										'com.2fdevs.videogular.plugins.controls',
										'com.2fdevs.videogular.plugins.overlayplay',
										'com.2fdevs.videogular.plugins.poster',
										'com.2fdevs.videogular.plugins.buffering',
										'js/app/music/ctrl.js',
										'js/app/music/theme.css'
									]);
								}
							]
						}
					})
					.state('music.home', {
						url: '/home',
						templateUrl: 'tpl/music.home.html'
					})
					.state('music.genres', {
						url: '/genres',
						templateUrl: 'tpl/music.genres.html'
					})
					.state('music.detail', {
						url: '/detail',
						templateUrl: 'tpl/music.detail.html'
					})
					.state('music.mtv', {
						url: '/mtv',
						templateUrl: 'tpl/music.mtv.html'
					})
					.state('music.mtvdetail', {
						url: '/mtvdetail',
						templateUrl: 'tpl/music.mtv.detail.html'
					})
					.state('music.playlist', {
						url: '/playlist/{fold}',
						templateUrl: 'tpl/music.playlist.html'
					})
			}
		]
	);