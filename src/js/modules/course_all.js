oeApp.controller('course_all', ['$scope', '$http', '$rootScope', '$ionicHistory', '$timeout', '$ionicModal', '$ionicPopup', 'EventBus', '$ionicPopover', 'Upload', '$ionicLoading', '$stateParams', '$sce', '$parse', '$interpolate','$ionicSlideBoxDelegate',
function($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover, Upload, $ionicLoading, $stateParams, $sce, $parse, $interpolate, $ionicSlideBoxDelegate) {
	$scope.showAllModal = false;
	$scope.closeAllModal = function (){
		$scope.showAllModal = 0;
	};
}
]);
