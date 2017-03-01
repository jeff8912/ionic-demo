//路由配置
var stateList = ['demo', {
		name: 'home',
		cache: true,
		showFooter: true
	}, 'message', 'my_collection', 'mine' ,
	, {
		name: 'login',
		cache: true,
		showFooter: false
	}
	, 'my_join'
	, 'my_info'
	, 'my_modify_pwd'
	, 'my_register'
	, 'my_feedback'
	, 'course_all'
	, {
		name: 'course_detail',
		cache: true,
		showFooter: false
	}
	, {
		name: 'home_search',
		cache: true,
		showFooter: false
	}
	, {
		name: 'race_detail',
		cache: true,
		showFooter: false
	}
	, {
		name: 'company_info',
		cache: true,
		showFooter: false
	}
	, {
		name: 'company_detail',
		cache: true,
		showFooter: false
	}
	, {
		name: 'company_list',
		cache: true,
		showFooter: false
	}
	, {
		name: 'activity_join',
		cache: true,
		showFooter: false
	}
	, {
		name: 'my_message',
		cache: true,
		showFooter: false
	}
	, {
		name: 'my_about',
		cache: true,
		showFooter: false
	}
	, {
		name: 'my_comment',
		cache: true,
		showFooter: false
	}
	, {
		name: 'my_modify_sex',
		cache: true,
		showFooter: false
	}
	, {
		name: 'my_modify_nickname',
		cache: true,
		showFooter: false
	}
	, {
		name: 'bases_detail',
		cache: true,
		showFooter: false
	}
	, {
		name: 'teacher_detail',
		cache: true,
		showFooter: false
	}
];

oeApp //angular.module('app.routes', [])

	.config(function($stateProvider, $urlRouterProvider) {

	angular.forEach(stateList, function(stateItem) {

		if(angular.isString(stateItem)) {
			$stateProvider.state('' + stateItem, {
				cache: true,
				showFooter: true,
				url: '/' + stateItem,
				templateUrl: 'templates/pages/' + stateItem + '.html',
				controller: stateItem
			});
		} else {
			$stateProvider.state('' + stateItem.name, {
				cache: angular.isUndefined(stateItem.cache) ? true : stateItem.cache,
				showFooter: angular.isUndefined(stateItem.showFooter) ? true : stateItem.showFooter,
				url: '/' + (stateItem.url || stateItem.name),
				templateUrl: 'templates/pages/' + stateItem.name + '.html',
				controller: stateItem.url || stateItem.name
			});
		}
	});
	//路由不存在则跳转到该路由
	$urlRouterProvider.otherwise('/home');
});
