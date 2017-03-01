oeApp.controller('race_detail', ['$scope', '$http', '$rootScope', '$ionicHistory', '$timeout', '$ionicModal', '$ionicPopup', 'EventBus', '$ionicPopover', 'Upload', '$ionicLoading', '$stateParams', '$sce', '$parse', '$interpolate','$ionicSlideBoxDelegate',
	function($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover, Upload, $ionicLoading, $stateParams, $sce, $parse, $interpolate, $ionicSlideBoxDelegate) {
		$scope.toggleIndex = 0;
		$scope.toggleTab = function (index){
			$scope.toggleIndex = index;
		};
	}
]);