/**
 * Created by rocky on 2015/6/16.
 *
 * @description ionic标准文件，angular的路由放到这里
 *
 **/

//测试时，把页面名写到这里：
var stateList = ['demo', {
		name: 'home',
		cache: true,
		hidefooter: false
	}, 'message', 'mine_collection', 'mine' , 'course_all'
];

znApp //angular.module('app.routes', [])

	.config(function($stateProvider, $urlRouterProvider) {

	angular.forEach(stateList, function(stateItem) {

		if(angular.isString(stateItem)) {
			$stateProvider.state('' + stateItem, {
				cache: true,
				hidefooter: true,
				url: '/' + stateItem,
				templateUrl: 'templates/pages/' + stateItem + '.html',
				controller: 'pageCtrl'
			});
		} else {
			$stateProvider.state('' + stateItem.name, {
				cache: angular.isUndefined(stateItem.cache) ? true : stateItem.cache,
				hidefooter: angular.isUndefined(stateItem.hidefooter) ? true : stateItem.hidefooter,
				url: '/' + (stateItem.url || stateItem.name),
				templateUrl: 'templates/pages/' + stateItem.name + '.html',
				controller: 'pageCtrl'
			});
		}

	});

	//首页，测试时，把页面名写到这里：

	$urlRouterProvider.otherwise('/home');

});
