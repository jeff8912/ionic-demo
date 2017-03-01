oeApp.controller('message', ['$scope', '$http', '$rootScope', '$ionicHistory', '$timeout', '$ionicModal', '$ionicPopup', 'EventBus', '$ionicPopover', 'Upload', '$ionicLoading', '$stateParams', '$sce', '$parse', '$interpolate','$ionicSlideBoxDelegate',
	function($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover, Upload, $ionicLoading, $stateParams, $sce, $parse, $interpolate, $ionicSlideBoxDelegate) {
		$scope.options = {
		  	loop: true,
		  	effect: 'fade',
		 	speed: 500,
		};
		$scope.clickLook = function (){
			debugger;
			$scope.openWindow('course_detail');
		}
	}
])