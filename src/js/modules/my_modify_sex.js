oeApp.controller('my_modify_sex', ['$scope', '$http', '$rootScope', '$ionicHistory', '$timeout', '$ionicModal', '$ionicPopup', 'EventBus', '$ionicPopover', 'Upload', '$ionicLoading', '$stateParams', '$sce', '$parse', '$interpolate','$ionicSlideBoxDelegate',
	function($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover, Upload, $ionicLoading, $stateParams, $sce, $parse, $interpolate, $ionicSlideBoxDelegate) {
		/*
		 * 公共方法，接收页面参数
		 * @return 参数列表，KeyValue
		 *
		 */
		$scope.pageParams = function() {
			console.log('pageParams=' + JSON.stringify($stateParams));
			return $stateParams;
		};
	}
]);
