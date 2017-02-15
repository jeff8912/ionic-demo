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
	}, {
		name: 'account',
		hidefooter: false
	}, 'login', {
		name: 'user_register',
		cache: false
	}, {
		name: 'user_registerbyurl',
		cache: false
	}, {
		name: 'user_create',
		url: 'user_create/:uciKey/:ticket'
	}, {
		name: 'user_password',
		url: 'user_password/:loginName'
	}, 'my_info', 'my_setting', 'my_setting_password', 'my_setting_message', 'my_setting_message_disturb', 'my_setting_base',
	'my_message', {
		name: 'news_release',
		url: 'news_release/:id/:abiId/:abiName',
		cache: false
	}, {
		name: 'news_detail',
		url: 'news_detail/:id'
	}, 'news_list', 'news_all', {
		name: 'honor_release',
		url: 'honor_release/:id'
	}, {
		name: 'honor_detail',
		url: 'news_detail/:id'
	}, 'honor_list', 'my_report_card', 'add_activity', 'activity_category', 'activity_sponsor', 'activity_organiser', 'my_comment', {
		name: 'expense_info',
		url: 'expense_info/:id/:abiId'
	}, {
		name: 'comment_personage',
		url: 'comment_personage/:id/:abiId'
	}, {
		name: 'comment_activity',
		url: 'comment_activity/:id'
	}, {
		name: 'apply_expense',
		url: 'apply_expense/:abiId'
	}, 'apply_expense_info', {
		name: 'activity_details',
		url: 'activity_details/:id/:type',
		cache: false
	}, 'activity_organizer', {
		name: 'my_sysmsg_list',
		url: 'my_sysmsg_list/:msgType'
	}, {
		name: 'my_sysmsg_detail',
		url: 'my_sysmsg_detail/:id',
		cache: false
	}, 'my_expense', {
		name: 'comment_info',
		url: 'comment_info/:id'
	}, 'expense_release', 'my_activity', {
		name: 'baidumap',
		url: 'baidumap/:lng/:lat'
	},{
    name: 'baidumapinfo',
    url: 'baidumapinfo/:lng/:lat/:loc'
  }, 'sys_news_list', {
		name: 'activity_list',
		url: 'activity_list/:type',
		cache: false
	}, {
		name: 'activity_enroll_list',
		url: 'activity_enroll_list/:abiId'
	}, {
		name: 'activity_search',
		cache: false
	}, {
		name: 'activity_search_list',
		url: 'activity_search_list/:categoryId/:keyword',
		cache: false
	}, {
		name: 'activity_organize_list',
		url: 'activity_organize_list/:abiId/:createId'
	}, {
		name: 'expense_edit',
		url: 'expense_edit/:aeiId'
	}, {
		name: 'edit_activity',
		url: 'edit_activity/:abiId'
	}, {
		name: 'user_home',
		url: 'user_home/:uuiId',
		cache: false
	}, {
		name: 'comment_activity_info',
		url: 'comment_activity_info/:aciId/:abiId'
	}, {
		name: 'my_setting_version',
		cache: false
	}, {
		name: 'comment_personage_info',
		url: 'comment_personage_info/:aciUserid/:abiId'
	}, {
		name: 'comment_personage_one',
		url: 'comment_personage_one/:aciId/:abiId'
	}, {
		name: 'activity_comment',
		url: 'activity_comment/:abiId'
	},{
		name: 'home_messsage',
		url: 'home_messsage'
	}
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
