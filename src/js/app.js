/*
 @description ionic标准文件，angular的定义，配置，放到这里
 * */
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var znApp = angular.module('znApp', ['ionic', 'app.services', 'app.directives', 'ngFileUpload'])

.config( [
    '$compileProvider', '$ionicConfigProvider',
    function( $compileProvider, $ionicConfigProvider)
    {
    	$ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back');
    	$ionicConfigProvider.backButton.previousTitleText('');
      //$ionicConfigProvider.views.maxCache(0);
      //$ionicConfigProvider.views.forwardCache(false);
      //$ionicConfigProvider.views.transition('ios');
      $ionicConfigProvider.views.transition('none');
      $ionicConfigProvider.views.swipeBackEnabled(false);
      $ionicConfigProvider.scrolling.jsScrolling(false);
      $ionicConfigProvider.tabs.position("bottom");
      $ionicConfigProvider.tabs.style("standard");
      $ionicConfigProvider.navBar.alignTitle("center");
    	//$ionicConfig.platform.ios.backButton.previousTitleText(false).text(backText).icon('ion-ios-arrow-back');
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|sms|tel|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
])

//.config(function($ionicNativeTransitionsProvider){
//
//	$ionicNativeTransitionsProvider.enable(false);
//	//$ionicNativeTransitions.enable(false);
//
////  $ionicNativeTransitionsProvider.setDefaultOptions({
////      duration: 0, // in milliseconds (ms), default 400,
////      slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
////      iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
////      androiddelay: -1, // same as above but for Android, default -1
////      winphonedelay: -1, // same as above but for Windows Phone, default -1,
////      fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
////      fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
////      triggerTransitionEvent: '$ionicView.beforeEnter', // internal ionic-native-transitions option
////      backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
////  });
////	$ionicNativeTransitionsProvider.setDefaultTransition({
////      type: 'slide',
////      direction: 'left'
////  });
////	$ionicNativeTransitionsProvider.setDefaultBackTransition({
////      type: 'slide',
////      direction: 'right'
////  });
//})

  .run(function($ionicPlatform) {
  	//FastClick.attach(document.body);//解决移动端点击响应慢问题
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(false);
        //cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.overlaysWebView(true);
    		StatusBar.styleLightContent();
		StatusBar.styleBlackTranslucent();
      }
    });
  }).factory("EventBus", function() {
    var eventMap = {};

    var EventBus = {
      on : function(eventType, handler) {
        //multiple event listener
        if (!eventMap[eventType]) {
          eventMap[eventType] = [];
        }
        eventMap[eventType].push(handler);
      },

      off : function(eventType, handler) {
        for (var i = 0; i < eventMap[eventType].length; i++) {
          if (eventMap[eventType][i] === handler) {
            eventMap[eventType].splice(i, 1);
            break;
          }
        }
      },

      fire : function(event) {
        var eventType = event.type;
        if (eventMap && eventMap[eventType]) {
          for (var i = 0; i < eventMap[eventType].length; i++) {
            eventMap[eventType][i](event);
          }
        }
      }
    };
    return EventBus;
  });
