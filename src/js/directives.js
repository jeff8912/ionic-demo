/**
 * Created by rocky on 2015/6/16.
 *
 * @description ionic标准文件，angular的指令、过虑器放到这里
 *
 **/

angular.module('app.directives', [])

/*
 * angular 过滤器：
 * 活动时间段格式化
 * 用法 {{activityObj | dateregion}}
 * */
  .filter('dateregion', function () {
    return function (activityObj) {
    	if(activityObj == undefined){
    		return '';
    	}
		// 活动开始时间
    	var startTime = moment(activityObj.abiStartTime);

    	// 活动结束时间
    	var endTime = moment(activityObj.abiEndTime);

    	// 启止时间是否大于一天
    	var isDays = startTime.subtract(endTime, 'days');

    	// 大于一天的显示
    	if (isDays > 0){
    		return startTime.format('YYYY/MM/DD')+' - '+endTime.format('YYYY/MM/DD');
    	}

    	// 24小时内的时间段显示
    	return startTime.format('YYYY/MM/DD HH:mm')+' - '+endTime.format('HH:mm');
    };
  })

/*
 * 活动时间 格式化
 * 用法 {{activityTime | formatDate}}
 * */
  .filter('formatDate', function () {
    return function (activityTime) {
    	if(activityTime)
			return moment(activityTime).format('YYYY-MM-DD HH:mm');
		else
			return "";
    };
  })

/*
 * 活动评论时间 格式化
 * 用法 {{formatCommentDate | formatDate}}
 * */
  .filter('formatCommentDate', function () {
    return function (formatCommentDate) {
    	if(formatCommentDate)
			return moment(formatCommentDate).format('MM-DD HH:mm');
		else
			return "";
    };
  })

  .filter('unsafe', [ '$sce', function ($sce) {
    return function (text) {
      return $sce.trustAsHtml(text);
    };
  } ])

  .directive('splitnumber', function () {
    return {
      require : 'ngModel',
      link : function (scope, element, attrs, modelCtrl) {

        modelCtrl.$parsers.push(function (inputValue) {

          var transformedInput = inputValue ? inputValue.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ") : inputValue;
          printLog('test splitnumber=' + transformedInput);
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  })

  // 金额格式化 <input currency ng-model="myMoney" /> or <input currency="2" ng-model="myMoney" />
  .directive('currency', function () {
    return {
      require : 'ngModel',
      link : function (scope, element, attrs, ngModelCtrl) {
        var numberFixed = attrs.hasOwnProperty('currency') ? parseInt(attrs.currency) : 2;
        ngModelCtrl.$formatters.push(function (val) {
          if (typeof val == "number")
            return val.ToMoney(numberFixed);
          return Number2Money(val);
        });
        element.focus(function () {
          if (this.value == "¥0.00")
            this.value = "";
          else
            this.value = Money2Number(this.value);
        });
        element.blur(function () {
          var val = this.value;
          if (typeof val == "string") {
            val = parseFloat(val.replace("¥", "").replaceAll(",", "").replace(" ", ""))
            val = Number2Money(val, numberFixed);
          }
          if (typeof val == "number")
            this.value = val.ToMoney(numberFixed);
          else
            this.value = Number2Money(Money2Number(val), numberFixed);
        });
      }
    }
  })
  // 金额格式化 <div>{{myMoney | currency : 2}}</div> or <div>{{myMoney | currency}}</div>
  .filter('currency', function () {
    return function (money, fixed) {
      fixed = fixed || 2;
      return Number2Money(money, fixed);
    };
  })

  .filter('formatImgUrl', function () {
    return function (url, size) {
      return formatImgUrl(url, size);
    };
  })

  .filter('formatDbImgUrl', function(){
       var filter = function(url, size){
           return formatDbImgUrl(url, size);
         };
       return filter;
     })

  //copyright
  .directive('copyright', function () {
    return {
      restrict : 'E',
      template : '<div class="copyright gray"><a href="http://zgjshop.com/" target="_blank"><img src="assets/images/copyright_logo.png" align="" height="32" /></a></div>',
      replace : true
    };
  })
  .directive('autoFocus', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      require: '^^ionNavView',
      link: function(scope, el, attrs, ctrl) {

        ctrl.scope.$on('$ionicView.afterEnter', function() {
          var checkAndFocus = function(){
            $timeout(function(){
              el[0].focus();
              if (document.activeElement != el[0]){
                $timeout(checkAndFocus, 500);
              }
            }, 200);
          };

          checkAndFocus();
        });
      }
    };
  }])
  .directive('focusMe', function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        if (attrs.focusMeDisable === "true") {
          return;
        }
        $timeout(function () {
          console.log('focusMe');
          element[0].focus();
          if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.show(); //open keyboard manually
          }
        }, 500);
      }
    };
  });
