/**
 * Created by rocky on 2015/6/16.
 *
 * @description ionic标准文件，angular的控制器放到这里
 *
 **/
//轮播参数
var indexSwiper = {};
var detailSwiper = {};
var prefix = '';
var swiperSettings = {
  slidesPerView: 1,
  paginationClickable: true,
  spaceBetween: 0,
  loop: true,
  watchSlidesVisibility: true,
  autoplay: 2500,
  autoplayDisableOnInteraction: false
};

znApp.constant('ngSortableConfig', {
  onEnd: function () {
    console.log('default onEnd()');
  }
}).controller('rootCtrl', ['$scope', '$http', '$ionicHistory', '$timeout', '$templateCache', 'EventBus', '$state', '$ionicModal', '$ionicScrollDelegate',
    function ($scope, $http, $ionicHistory, $timeout, $templateCache, EventBus, $state, $ionicModal, $ionicScrollDelegate) {
      //回滚到顶部
      $scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop();
      };
      $scope.blurPixel = "";
      $scope.model = {
        isShowRelease: "hidden",
        isShowModal: "hidden",
        isShowShare: "hidden"
      }
      /*//获取用户信息
      $scope.getUser = function (ret_url) {
        ajaxPost.call($scope, $http, API_appserverurl + "/api/user/getModel", {}, "用户信息", function (ret) {
          if (!ret && uuiId == 0) {
            islogined = false;
            $state.go('login');
          } else {
            // $scope.model = ret;
            uuiId = ret.id;
            islogined = true;
            if (!ret.imgUrl)
              ret.imgUrl = (ret.uuiSex == 0 ? './img/my_portrait_bg_girl.png' : './img/my_portrait_bg_boy.png');
            $scope.userInfo = ret;
            $scope.setTagsWithAlias(ret);
            EventBus.fire({type: "notice.index.getUser", data: ret});//获取用户信息通知
          }
        }, function (err) {
          if (uuiId == 0) {
            islogined = false;
            $state.go('login');
          }
          // EventBus.fire({type: "notice.index.getUser", data: null});//获取用户信息通知
        });
      };
      $scope.getUser();*/

      // window.addEventListener('native.keyboardshow',eventHandler);
      // function eventHandler(){
      //   document.body.scrollTop=0;
      //   document.documentElement.scrollTop = 0;//兼容不同版本的浏览器
      //   window.pageYOffset = 0;
      // }
      $scope.hideNavFooterBar = false;
      //打开弹出
      $scope.openModal = function () {
        $scope.blurPixel = "blurPixel";
        $scope.model.isShowRelease = "visible";
        $scope.model.isShowModal = "visible";
        var i = 0;
        var rotate = $(".add-close").find(".col");
        var interval = setInterval(function () {
          i += 5;
          rotate.rotate(i);
          if (i == 45) {
            clearInterval(interval);
          }
        }, 10);

      };
      //关闭弹出
      $scope.closeModal = function () {
        $scope.blurPixel = "";
        $scope.model.isShowRelease = "hidden";
        $scope.model.isShowModal = "hidden";
      };
      //搜索框切换
      $scope.toggleSearchBox = function () {
        $scope.showSearchBox = !$scope.showSearchBox;
      }
      //荣誉下拉切换
      $scope.$parent.openHonorModal = function () {
        $scope.showHonorModal = !$scope.showHonorModal;
      }
      /*
       * 公共方法，打开一个页面
       * @param stateName 页面的状态名
       * @param keyValueParam 参数列表，KeyValue，可选
       *
       */
      $scope.openWindow = function (stateName, keyValueParam) {
        keyValueParam = keyValueParam || {}; //eg. {goodsDetailUrl:target_url}
        // window.open( target_url,'_bank','location=yes')
        console.log('openWindow: state=' + stateName + ', params=' + JSON.stringify(keyValueParam));
        $state.go(stateName, keyValueParam);
      };
      $scope.setTagsWithAlias = function (ret) {
        if (zn.isDevice()) {
          if (zn.deviceready) {
            console.log('jpush set start');
            var tags = [];
            if (_.isObject(ret.uoiId) && ret.uoiId.pid != ret.ubiId.id) {
              if (ret.uoiId.pid)
                tags.push('2_' + ret.uoiId.pid.toString());
              tags.push('3_' + ret.uoiId.id.toString());
              if (_.isArray(ret.abiIdList)) {
                _(ret.abiIdList).forEach(function (value) {
                  tags.push('5_' + value.toString());
                });
              }
            }
            console.log("tags:" + tags + ',alias:1_' + ret.id.toString());
            var push = window.plugins && window.plugins.jPushPlugin;
            if (push) {
//              plugins.jPushPlugin.resumePush();
              console.log("plugins.jPushPlugin.setTagsWithAlias:" + typeof plugins.jPushPlugin.setTagsWithAlias);
              window.plugins.jPushPlugin.setTagsWithAlias(tags, '1_' + ret.id.toString());
            }
            console.log('jpush set end');
          } else {
            $timeout(function () {
              $scope.setTagsWithAlias(ret);
            }, 1000);
          }
        }
      }

      $scope.removeUrlCache = function (url) {
        if (_.isString(url) && url != null && url != '') {
          $templateCache.remove(url.indexOf('templates/pages/') == -1 ? 'templates/pages/' + url + '.html' : url);
        } else {

          angular.forEach(stateList, function (stateItem) {
            if (angular.isString(stateItem))
              $templateCache.remove('templates/pages/' + stateItem + '.html');
            else
              $templateCache.remove('templates/pages/' + stateItem.name + '.html');
          });
        }
      }

      //消息接收处理
      //
      $scope.revicemessages = 0;
      $scope.receiveNotification = function (data, cbtype) {
        console.log('rootCtrl接收:' + JSON.stringify(data));
        var npiType, npiKind;
        if (zn.device.platform.toLowerCase() == "android") {
          npiType = data.extras.npiType;
          npiKind = data.extras.npiKind;
        } else {
          npiType = data.npiType;
          npiKind = data.npiKind;
        }
        sysConfigData.notification.msgAllcount++;
        if (npiType == "0") {
          sysConfigData.notification.sysMsgCount++;
        } else if (npiKind == "2") {
          sysConfigData.notification.activityNoticeCount++;
        } else {
          sysConfigData.notification.sysMsgCount++;
        }

        if (cbtype) {
          $scope.revicemessages = sysConfigData.notification.msgAllcount;
        } else {
          $scope.$apply(function () {
            $scope.revicemessages = sysConfigData.notification.msgAllcount;
          });
        }
        db.add('receiveNotificationCount', sysConfigData.notification);

        EventBus.fire({type: "notice.index.receiveNotification", data: sysConfigData.notification});//接收极光推送信息广播
      }
      $scope.testReviceMessage = function (type) {
        var tmpand = {
          "alert": "测试叮叮叮叮叮叮一下",
          "title": "青春科大",
          "extras": {
            "cn.jpush.android.MSG_ID": "3161647728",
            "npiKind": "0",
            "npiId": "5775d4b6d761f5cc1818f3c3",
            "cn.jpush.android.ALERT": "测试叮叮叮叮叮叮一下",
            "cn.jpush.android.EXTRA": {"npiType": 1, "npiId": "5775d4b6d761f5cc1818f3c3", "npiKind": 0},
            "npiType": "1",
            "cn.jpush.android.NOTIFICATION_ID": 187499022
          }
        }
        var tmpios = {
          "aps": {
            "badge": 1,
            "sound": "default",
            "alert": "测试叮叮叮叮叮叮一下"
          },
          "npiType": "1",
          "npiKind": "0",
          "npiId": "5775d4b6d761f5cc1818f3c3",
          "_j_msgid": 3161647728
        }
        $scope.receiveNotification(type == 1 ? tmpand : tmpios, tmpios);
      }
      $scope.loadReviceData = function (data) {
        if (zn.deviceready) {
          if (_.isObject(data)) {
            sysConfigData.notification = data;
            $scope.revicemessages = sysConfigData.notification.msgAllcount;
            db.add('receiveNotificationCount', sysConfigData.notification);
            if (zn.device.platform.toLowerCase() != "android") {
              window.plugins.jPushPlugin.setApplicationIconBadgeNumber(sysConfigData.notification.msgAllcount);
            }
          } else {
            db.get('receiveNotificationCount', function (revicecount) {
              if (_.isObject(revicecount) && !_.isUndefined(revicecount.msgAllcount)) {
                $scope.revicemessages = revicecount.msgAllcount;
                sysConfigData.notification = revicecount;
              }
            });
          }
        } else {
          $timeout(function () {
            $scope.loadReviceData(data);
          }, 500);
        }
      }
      if (zn.isDevice())
        $scope.loadReviceData();

      $scope.getScrollPosition = function () {
        return $ionicScrollDelegate.getScrollPosition();
      }

      $scope.currStateName = '';//self.location.hash.replace('#/', '');

      //开始切换页面，执行顺序：1
      $scope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          console.log('on stateChangeStart ...');
          $scope.currStateName = toState.name;
          $scope.hideNavFooterBar = toState.hidefooter;

          if (toState.name == 'login') {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard)
              cordova.plugins.Keyboard.disableScroll(false);
            if (window.StatusBar)
              StatusBar.styleDefault();
          } else {

            if (toState.name == 'home') {
              $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
              });
            }

            /*if (!islogined && _.indexOf(['user_create', 'user_register', 'user_registerbyurl', 'user_password', 'baidumap', 'activity_search'], toState.name) == -1) {

              $timeout(function () {
                $state.go('login');
              }, 100);
              //return;
            }*/

            if (fromState && fromState.name == 'login' && toState.name != 'login' && window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard)
              cordova.plugins.Keyboard.disableScroll(true);
            if (window.StatusBar)
              StatusBar.styleLightContent();
          }

        });

      //切换页面中，执行顺序：2
      $scope.$on('$viewContentLoading', function (event, viewConfig) {
        console.log('on viewContentLoading ...');
        if (window.cordova && window.cordova.plugins && cordova.plugins.Keyboard.isVisible) {
          console.log('$viewContentLoading:isVisible cordova.plugins.Keyboard.closed');
          cordova.plugins.Keyboard.close();
        }
        var tempUrl = viewConfig.view.url.prefix;
        if (tempUrl != "/activity_organiser" && tempUrl != "/baidumap/" && tempUrl != "/activity_details/")
          $ionicScrollDelegate.scrollTop();
      });

      //切换页面成功，执行顺序：3
      $scope.$on('$stateChangeSuccess', function (event, state) {

        console.log('on stateChangeSuccess ...');
        $scope.currStateName = state.name;
        $timeout(function () {
          EventBus.fire({type: "page.initApp", data: state});//页面地址变更通知
        }, 10);
      });

      //，执行顺序：4
      $scope.$on("$ionicView.beforeEnter", function (event, data) {
        // handle event
        console.log("on beforeEnter State Params: ", data.stateParams);
      });

      //，执行顺序：5
      $scope.$on("$ionicView.enter", function (event, data) {
        // handle event
        console.log("on enter State Params: ", data.stateParams);
      });

      //，执行顺序：6
      $scope.$on("$ionicView.afterEnter", function (event, data) {
        // handle event
        console.log("on afterEnter State Params: ", data.stateParams);

        if (data.stateId == "home") {
          angular.forEach(indexSwiper, function (value, key) {
            indexSwiper[key].startAutoplay();
          });
        } else if (data.stateId != "home") {
          angular.forEach(indexSwiper, function (value, key) {
            indexSwiper[key].stopAutoplay();
          });
        }
//      else if (detailSwiper && data.stateId == "activity_details") {
//      }

        //zn.hideWaiting();
      });

      //切换页面错误
      $scope.$on('$stateChangeError', function (event) {
        console.error('$stateChangeError...');
      });

      //切换页面，不存在
      $scope.$on('$stateNotFound', function (event) {
        console.log('$stateNotFound...');
      });

    }])

  .controller('pageCtrl', ['$scope', '$http', '$rootScope', '$ionicHistory', '$timeout', '$ionicModal', '$ionicPopup', 'EventBus', '$ionicPopover', 'Upload', '$ionicLoading', '$stateParams', '$sce', '$parse', '$interpolate',
    function ($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover, Upload, $ionicLoading, $stateParams, $sce, $parse, $interpolate) {
      /*
       * 公共方法，接收页面参数
       * @return 参数列表，KeyValue
       *
       */
      $scope.pageParams = function () {
        console.log('pageParams=' + JSON.stringify($stateParams));
        return $stateParams;
      }
      if (window.hasOwnProperty('pageCtrl'))
        pageCtrl($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover, Upload, $ionicLoading, $stateParams, $sce, $parse, $interpolate);
    }])

  .controller('microPageCtrl', function ($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover) {

  })

  .controller('navCtrl', function ($scope, $http, $rootScope, $ionicHistory, $timeout, $ionicModal, $ionicPopup, EventBus, $ionicPopover) {

    $scope.checkView = function (viewName) {
      return $scope.currStateName.indexOf(viewName) > -1;
    };

//  $scope.$on('$stateChangeStart',
//      function (event, toState, toParams, fromState, fromParams) {
//  //$scope.$on('$stateChangeSuccess', function (event, toState) {
//    console.log('navCtrl stateChangeSuccess ...state.name=' + toState.name);
//
//    //EventBus.fire({type: "page.initApp", data: toState});//页面地址变更通知
//  });

  });
