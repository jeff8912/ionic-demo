oeApp.controller('my_info', ['$scope', '$http', '$rootScope', '$ionicHistory', '$timeout', '$ionicModal', '$ionicPopup', 'EventBus', '$ionicPopover', 'Upload', '$ionicLoading', '$stateParams', '$sce', '$parse', '$interpolate','$ionicSlideBoxDelegate',
	function($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover, Upload, $ionicLoading, $stateParams, $sce, $parse, $interpolate, $ionicSlideBoxDelegate) {
		/*
		 * 鍏叡鏂规硶锛屾帴鏀堕〉闈㈠弬鏁�
		 * @return 鍙傛暟鍒楄〃锛孠eyValue
		 *
		 */
		$scope.pageParams = function() {
			console.log('pageParams=' + JSON.stringify($stateParams));
			return $stateParams;
		};
	}
]);
