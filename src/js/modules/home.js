oeApp.controller('home', ['$scope', '$http', '$rootScope', '$ionicHistory', '$timeout', '$ionicModal', '$ionicPopup', 'EventBus', '$ionicPopover', 'Upload', '$ionicLoading', '$stateParams', '$sce', '$parse', '$interpolate','$ionicSlideBoxDelegate',
	function($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover, Upload, $ionicLoading, $stateParams, $sce, $parse, $interpolate, $ionicSlideBoxDelegate) {
		$scope.options = {
		  	loop: true,
		  	effect: 'fade',
		 	speed: 500,
		};
		//跳转到课程详情
		$scope.clickLook = function (){
			$scope.openWindow('course_detail');
		};
		//跳转到搜索页面
		$scope.gotoSearch = function (){
			$scope.openWindow('home_search');
		};
	}
]);