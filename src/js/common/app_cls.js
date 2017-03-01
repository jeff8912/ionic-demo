/*
 @description 封装的类对象放在这里
 * */

//通过ＵＲＬ打开的回调
//通过ＵＲＬ激活＼打开ＡＰＰ的处理方法
function handleOpenURL(url) {
  if (url) {
	  	ins.openUrl = url;
	  	console.log("received url: " + url);
	  	var _hash = ins.openUrl.replace(/joininustc\:\/\//i,'#/');
	  	setTimeout(function () {
	  		window.location.hash = _hash;
	  		console.log("goto url: " + _hash);
	  	},50);
  	}
}

//自动更新程序对象
var chcp_update = (function (doc) {
	
	var self = this;
	
	self.eventCallback = function (eventData) {
		
		console.log(eventData);
		if (!eventData.details)
			return;
			
	  var error = eventData.details.error;
	  
	  if (error && error.code == chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
        console.log('需要更新安装包');
        chcp.requestApplicationUpdate('应用市场有新的版本，请更新', function() {
		    console.log('用户确认，跳转到下载页面');
		  }, function() {
		    console.log('用户取消，关闭程序');
		    navigator.app.exitApp();
		});
		return;
      } else if (error) {
	    console.log('更新组件事件，错误码: ' + error.code);
	    console.log('描述: ' + error.description);
	    return;
	  }
	  
	  //console.log('更新组件事件(无错误码), 事件对象: ');
	  
	};

    doc.addEventListener("chcp_updateIsReadyToInstall", self.eventCallback, false);
    doc.addEventListener("chcp_updateLoadFailed", self.eventCallback, false);
    doc.addEventListener("chcp_nothingToUpdate", self.eventCallback, false);
    doc.addEventListener("chcp_beforeInstall", self.eventCallback, false);
    doc.addEventListener("chcp_updateInstalled", self.eventCallback, false);
    doc.addEventListener("chcp_updateInstallFailed", self.eventCallback, false);
    doc.addEventListener("chcp_nothingToInstall", self.eventCallback, false);
    doc.addEventListener("chcp_beforeAssetsInstalledOnExternalStorage", self.eventCallback, false);
    doc.addEventListener("chcp_assetsInstalledOnExternalStorage", self.eventCallback, false);
    doc.addEventListener("chcp_assetsInstallationError", self.eventCallback, false);
    
    //检查更新
    self.checkForUpdate = function(cb) {
    	var options = {
		  'config-file': 'http://joinapi.zgjshop.com/app/chcp.json'
		};
      chcp.fetchUpdate(function(error, data) {
      	if (error && error.code == chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
	        console.log('需要更新安装包');
	        chcp.requestApplicationUpdate('应用市场有新的版本，请更新', function() {
			    console.log('用户确认，跳转到下载页面');
			  }, function() {
			    console.log('用户取消，关闭程序');
			    navigator.app.exitApp();
			  });
	    } else if (error) {
	      console.log('检查更新失败，错误码: ' + error.code);
	      console.log(error.description);
	    } else {
	      console.log('更新已经准备好');
	      if (cb)
	      	cb();
	    }
	  }, options);
    }; 
    
    //安装更新
    self.installUpdate = function () {
    		chcp.installUpdate(function(error) {
		    if (error) {
		      console.log('安装更新失败，错误码: ' + error.code);
		      console.log(error.description);
		    } else {
		      console.log('更新已安装!');
		    }
		});
    };
    
    //执行检查并安装更新
    self.doUpdate = function () {
	    	self.checkForUpdate(function () {
	    		self.installUpdate();
	    	});
    };
    
    //设备初始化事件
    doc.addEventListener('deviceready', function () {
		self.doUpdate();
	}, false);
	
	//app切换到前台
    doc.addEventListener('resume', function () {
    		console.log('app切换到前台!');
		self.doUpdate();
	}, false);
    
    return self;
    
})(document);

/**
 * @description 原生接口操作类
 */
var zn = (function (w) {

  var ins = {deviceready: false, device: null, versionInfo: null, openUrl: null};

  ins.openURL = handleOpenURL;
  
  /*
   * 是否移动设备
   */
  ins.isDevice = function () {
    return !!window.cordova;
  }


  console.log('addEventListener deviceready');

  /*
   * 设备事件，设备接口准备好了，会调用本接口
   */
  document.addEventListener("deviceready", function onDeviceReady() {
    console.log('on deviceready');
    ins.deviceready = true;
    
	
	//通过ＵＲＬ打开的ＡＰＰ？
//	if (ins.openUrl != null){
//		alert("通过ＵＲＬ打开："+ins.openUrl);
//	}
//	if (window.plugins && window.plugins.launchmyapp){
//		window.plugins.launchmyapp.getLastIntent(function(url) {
//	      if (intent.indexOf('joininUstc://' > -1)) {
//	        alert("received url: " + url);
//	      } else {
//	        return console.log("ignore intent: " + url);
//	      }
//	    }, function(error) {
//	      return console.log("no intent received");
//	    });
//  }
    
    //获取版本信息
    $.getJSON("version.json?r="+(new Date()).getTime(), function(json) {
    		ins.versionInfo = json;
    		console.log("版本信息: "); 
	    console.log(ins.versionInfo.version); // this will show the info it in firebug console
	});

//	window.sqlitePlugin.echoTest(function () {
//		console.log("DB echoTest OK");
//	}, function () {
//		console.log("DB echoTest ERROR");
//	});
//	window.sqlitePlugin.selfTest(function () {
//		console.log("DB selfTest OK");
//	}, function () {
//		console.log("DB selfTest ERROR");
//	});

    //splashscreen
    //隐藏启动页
    setTimeout(function () {
      navigator.splashscreen.hide();
    }, 600);

    //device
    ins.device = device;
    console.log('cordova version = ' + ins.device.cordova);
    console.log('platform = ' + ins.device.platform);
    console.log('os version = ' + ins.device.version);
    console.log('serial = ' + ins.device.serial);

    //network
    if (!ins.networkState) {
      ins.networkState = {};
      ins.networkState[Connection.UNKNOWN] = ['未知网络状态', '您是火星手机网络吗，请尽快连接地球'];
      ins.networkState[Connection.ETHERNET] = ['因特网', '网络开小差了，请重试'];
      ins.networkState[Connection.WIFI] = ['WIFI无线网络', '网络开小差了，请重试'];
      ins.networkState[Connection.CELL_2G] = ['2G网络', '您还在用2G网络吗，可能不太稳定哦'];
      ins.networkState[Connection.CELL_3G] = ['3G网络', '网络开小差了，请重试'];
      ins.networkState[Connection.CELL_4G] = ['4G网络', '网络开小差了，请重试'];
      ins.networkState[Connection.CELL] = ['蜂窝网络 ', '您在用蜂窝网络吗，可能不太稳定哦'];
      ins.networkState[Connection.NONE] = ['无网络', '您是不是忘记打开网络了'];
    }


    //DB INIT:
    if (ins.device.platform.toLowerCase() == 'ios') {
      window.sqlliteStorage = window.sqlitePlugin.openDatabase({name: 'cache.db', iosDatabaseLocation: 'Library'});
    } else {
      window.sqlliteStorage = window.sqlitePlugin.openDatabase({name: 'cache.db', location: 'default'}, function () {
        console.log("openDatabase OK");
      }, function () {
        console.log("openDatabase ERROR");
      });
    }
    window.sqlliteStorage.executeSql('CREATE TABLE IF NOT EXISTS cache_table (key text primary key, data text)');
    //DB END

    //JPUSH INIT
    console.log('jpush: start init-----------------------');
    push = window.plugins && window.plugins.jPushPlugin;
    if (push) {
      console.log('jpush: init');
      window.plugins.jPushPlugin.init();
      ins.getRegistrationID();
      console.log('device.platform:'+ins.device.platform.toLowerCase())
      if (ins.device.platform.toLowerCase() != "android") {
        window.plugins.jPushPlugin.setDebugModeFromIos();
        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
      } else {
        window.plugins.jPushPlugin.setDebugMode(true);
        window.plugins.jPushPlugin.setStatisticsOpen(true);
      }
      console.log('jpush: end init-----------------------');
    }

  }, false);

  ins.getRegistrationID = function() {
    window.plugins.jPushPlugin.getRegistrationID(function(data) {
      try {
        console.log("JPushPlugin:registrationID is " + data);
        if (data.length == 0) {
          var t1 = window.setTimeout(zn.getRegistrationID, 10000);
        // }else{
        //   showInfo('jPushPlugin.getRegistrationID:'+data)
        }
        console.log(data);
      } catch (exception) {
        console.log(exception);
      }
    });
  };
  document.addEventListener("jpush.setTagsWithAlias", function(event) {
    try {
      console.log("onTagsWithAlias");
      var result = "result code:" + event.resultCode + " ";
      result += "tags:" + event.tags + " ";
      result += "alias:" + event.alias + " ";
      console.log(result);
    } catch (exception) {
      console.log(exception)
    }
  }, false);
  document.addEventListener("jpush.openNotification", function(event) {
    try {
      var alertContent,npiType,npiKind;
      if (ins.device.platform.toLowerCase() == "android") {
        alertContent = window.plugins.jPushPlugin.openNotification.alert;
        npiType = window.plugins.jPushPlugin.openNotification.extras.npiType;
        npiKind = window.plugins.jPushPlugin.openNotification.extras.npiKind;
      } else {
        alertContent = event.aps.alert;
        npiType = event.npiType;
        npiKind = event.npiKind;
      }
      angular.element('#rootCtrl').scope()['openWindow']('my_message');
    } catch (exception) {
      console.log("JPushPlugin:onOpenNotification" + exception);
    }
  }, false);
  document.addEventListener("jpush.receiveNotification", function(event) {
    try {
      var alertContent;
      if (ins.device.platform.toLowerCase() == "android") {
        alertContent = _.clone(window.plugins.jPushPlugin.receiveNotification);//.alert;
      } else {
        alertContent = _.clone(event);//.aps.alert;
      }
      console.log(JSON.stringify(alertContent));
      angular.element('#rootCtrl').scope()['receiveNotification'](alertContent);
    } catch (exception) {
      console.log(exception)
    }
  }, false);
  // document.addEventListener("jpush.receiveMessage", function(event) {
  //   try {
  //     var message;
  //     if (ins.device.platform.toLowerCase() == "android") {
  //       message = window.plugins.jPushPlugin.receiveMessage;
  //     } else {
  //       message = event;
  //     }
  //     console.log('receiveMessage:'+JSON.stringify(message));
  //   } catch (exception) {
  //     console.log("JPushPlugin:onReceiveMessage-->" + exception);
  //   }
  // }, false);

  //扩展存储接口
  ins.storage = {
    setItem: function (key, value) {
      //var val = JSON.stringify(value);
      if (!ins.deviceready) {

        localStorage.setItem(key, value);
        console.log('插件环境Cordova没有准备好');
        return false;
      }
      window.sqlliteStorage.sqlBatch([
        ['DELETE FROM cache_table WHERE key=?', [key]],
        ['INSERT INTO cache_table VALUES (?,?)', [key, value]]
      ], function (resultSet) {
        console.log('resultSet.insertId: ' + resultSet.insertId);
        console.log('resultSet.rowsAffected: ' + resultSet.rowsAffected);
      }, function (error) {
        console.log('SELECT error: ' + error.message);
      });
    },
    getItem: function (key, callback) {

      if (!ins.deviceready) {
        var val = localStorage.getItem(key);
        console.log('插件环境Cordova没有准备好');
        if (val)
          callback(val);
        else
          callback(null);
      }else {
        console.log('db GET key=' + key);
        window.sqlliteStorage.executeSql('SELECT data FROM cache_table WHERE key=?', [key], function (resultSet) {
          if (resultSet.rows && resultSet.rows.length > 0) {
            console.log('Sample column value: ' + resultSet.rows.item(0).data);
            callback(resultSet.rows.item(0).data);
          } else {
            callback(null);
          }
        }, function (error) {
          console.log('SELECT error: ' + error.message);
          callback(null);
        });
      }
    },
    removeItem: function (key) {
      if (!ins.deviceready) {
        localStorage.removeItem(key);
        console.log('插件环境Cordova没有准备好');
        return false;
      }
      window.sqlliteStorage.executeSql('DELETE FROM cache_table WHERE key=?', [key], function (resultSet) {
        // if(resultSet.rows.length > 0) {
        //   console.log('Sample column value: ' + resultSet.rows.item(0).data);
        //   callback(resultSet.rows.item(0).data);
        // }else{
        //   callback(null);
        // }
      }, function (error) {
        console.log('DELETE error: ' + error.message);
        // callback(null);
      });
    },
    clear: function () {
      if (!ins.deviceready) {
        localStorage.clear();
        console.log('插件环境Cordova没有准备好');
        return false;
      }
      window.sqlliteStorage.sqlBatch([
        'DROP TABLE IF EXISTS cache_table',
        'CREATE TABLE cache_table (key text primary key, data text)'
      ]);
    }
  };

  /*
   * 获取GPS位置
   * API参考：https://www.npmjs.com/package/cordova-plugin-geolocation
   *
   */
  ins.getPosition = function (onSuccess, onError) {

    console.log('call getPosition()');

    if (!ins.deviceready) {
      onError({code: 1, message: '插件环境Cordova没有准备好'});
      return false;
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('getPosition(), ' + '\n' +
        'Latitude: ' + position.coords.latitude + '\n' +
        'Longitude: ' + position.coords.longitude + '\n' +
        'Altitude: ' + position.coords.altitude + '\n' +
        'Accuracy: ' + position.coords.accuracy + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
        'Heading: ' + position.coords.heading + '\n' +
        'Speed: ' + position.coords.speed + '\n' +
        'Timestamp: ' + position.timestamp + '\n');
      if (onSuccess)
        onSuccess(position);
    }, onError);

  }

  /*
   * 获取网络状态
   * document.addEventListener("offline", onOffline, false); //离线
   * document.addEventListener("online", yourCallbackFunction, false); //在线
   */
  ins.checkConnection = function () {
    if (!ins.deviceready) {
      console.log('插件环境Cordova没有准备好');
      return false;
    }

    var _networkState = navigator.connection.type;
    console.log('网络 类型: ' + ins.networkState[_networkState][0]);
    return ins.networkState[_networkState][0];
  }

  /*
   * 清理缓存
   */
  ins.clearCache = function (sucesscb, errorcb) {
    if (!ins.deviceready) {
      console.log('插件环境Cordova没有准备好');
      return false;
    }
    console.log('clearCache ...');
    window.cache.clear(function success(status) {
      console.log('clearCache success: ' + status);
      if (sucesscb)
        sucesscb(status);
    }, function error(status) {
      console.log('clearCache error: ' + status);
      if (errorcb)
        errorcb(status);
    });

    window.cache.cleartemp(); //清理缓存
  }


  ins.qrcodeScan = function (callback) {

    if (!ins.deviceready) {
      console.log('插件环境Cordova没有准备好');
      return false;
    }

    cordova.plugins.barcodeScanner.scan(
      function (result) {
        console.log("We got a barcode\n" +
          "Result: " + result.text + "\n" +
          "Format: " + result.format + "\n" +
          "Cancelled: " + result.cancelled);
        callback(result);
      },
      function (error) {
        callback({code: 1, message: "读取失败，请重试: " + error});
      },
      {
        "preferFrontCamera": false, // iOS and Android
        "showFlipCameraButton": false, // iOS and Android
        //"prompt" : "Place a barcode inside the scan area", // supported on Android only
        "formats": "QR_CODE"//, // default: all but PDF_417 and RSS_EXPANDED
        //"orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
      }
    );
  }


  ins.showWaiting = function (txt) {
    if (!ins.deviceready) {
      showLoading();
      console.log('插件环境Cordova没有准备好');
      return false;
    }
    txt = txt || null;
    window.plugins.spinnerDialog.show(null, txt, true);
    setTimeout(function () {
      window.plugins.spinnerDialog.hide();
    }, 10000);
  }

  ins.hideWaiting = function () {
    if (!ins.deviceready) {
      hideLoading();
      console.log('插件环境Cordova没有准备好');
      return false;
    }
    window.plugins.spinnerDialog.hide();
  }

  /**
   * @description 显示自动隐藏的提示（系统）
   * @param txt 显示内容
   * @param duration 显示时长，毫秒，默认3s
   * @param position 显示位置，默认在底部
   */
  ins.showToast = function (txt, duration, pstion) {
    if (!ins.deviceready) {
      showInfoBox(txt);
      console.log('插件环境Cordova没有准备好');
      return false;
    }

    duration = duration || 3000;
    pstion = pstion || 'bottom';
    //window.plugins.toast.showLongBottom(txt, duration, pstion);
    window.plugins.toast.showWithOptions({
      'message': txt,
      'duration': duration,
      'position': pstion,
      'addPixelsY': -60

    });
  }


  /**
   * @description 显示网络错误
   */
  ins.ShowNetworkError = function () {

    if (!ins.deviceready) {
      console.log('插件环境Cordova没有准备好');
      return false;
    }

    var _networkState = navigator.connection.type;
    console.log('网络 提示语: ' + ins.networkState[_networkState][1]);
    return ins.networkState[_networkState][1];
  };


  return ins;

})(window);

/**
 * @description 数据库操作对象
 */
var db = (function (w) {

  var ins = {};

  /**
   * @description 写入一个对象 Key，Value
   */
  ins.add = function (key, value) {
    //if (w.sqlliteStorage) {
    var val = JSON.stringify(value);
    zn.storage.setItem(key, val);
    //}
  }

  /**
   * @description 获取一个对象，key
   */
  ins.get = function (key, cb) {
    //printLog("------------------");
    //if (w.sqlliteStorage) {
    //printLog("----##--------------");
    zn.storage.getItem(key, function (val) {
      try {
        //printLog("------------------"+val);
        if (val)
          cb(JSON.parse(val));
        else
          cb(null);
      } catch (e) {
        printError('db.get key=' + key);
        printError(e);
      }
    });
    //}
    //return null;
  }

  ins.saveCaller = function (caller, data) {
    var key = JSON.stringify(caller);
    ins.add(key, data);
  }

  ins.getCaller = function (caller) {
    var key = JSON.stringify(caller);
    var val = ins.get(key);
    return val;
  }


  /**
   * @description 删除一个对象，Key
   */
  ins.del = function (key) {
    //if (w.sqlliteStorage)
    zn.storage.removeItem(key);
  }

  ins.remove = function (key) {
    ins.del(key);
  }
  /**
   * @description 清除所有数据
   */
  ins.clearall = function () {
    //if (w.sqlliteStorage)
    zn.storage.clear();
  }

  /**
   * @description 更新一个对象
   */
  ins.update = function (key, value) {
    //if (w.sqlliteStorage) {
    //val = JSON.stringify(value);
    zn.storage.setItem(key, val);
    //}
  }
  return ins;

})(window);


/**
 * @description 百度、谷歌坐标偏移
 */
var _Wars2WgsByAlgorithm = (function (w) {

  var ins = {pi:3.1415926535897931,x_pi:52.359877559829883,aa: 6378245.0,ee: 0.0066934216229659433};

  ins.outOfChina = function (lat, lon) {
    return (((lon < 72.004) || (lon > 137.8347)) || ((lat < 0.8293) || (lat > 55.8271)));
  }

  ins.Wgs84Encrypt = function (wgLat, wgLon, maptype) {
    if (maptype == 'baidu') {
      return ins.Wgs84ToBd09(wgLat, wgLon);
    } else if (maptype == 'google') {
      return ins.Wgs84ToGoogle(wgLat, wgLon);
    }
    return {Lat: wgLat, Lng: wgLon};
  }

  ins.Wgs84ToBd09 = function (wgLat, wgLon) {
    var lnglat = ins.Transform(wgLat, wgLon);
    return ins.bd_encrypt(lnglat.Lat, lnglat.Lng);

  }
  ins.Transform = function (wgLat, wgLon) {
    var lat = {Lat: wgLat, Lng: wgLon};
    if (ins.outOfChina(wgLat, wgLon)) {
      lat.Lat = wgLat;
      lat.Lng = wgLon;
      return lat;
    }
    var num = ins.transformLat(wgLon - 105.0, wgLat - 35.0);
    var num2 = ins.transformLon(wgLon - 105.0, wgLat - 35.0);
    var a = (wgLat / 180.0) * ins.pi;
    var d = Math.sin(a);
    d = 1.0 - ((ins.ee * d) * d);
    var num5 = Math.sqrt(d);
    num = (num * 180.0) / (((ins.aa * (1.0 - ins.ee)) / (d * num5)) * ins.pi);
    num2 = (num2 * 180.0) / (((ins.aa / num5) * Math.cos(a)) * ins.pi);
    lat.Lat = ins.formatLngLat(wgLat + num);
    lat.Lng = ins.formatLngLat(wgLon + num2);
    return lat;
  }
  ins.transformLat = function (x, y) {
    var num = ((((-100.0 + (2.0 * x)) + (3.0 * y)) + ((0.2 * y) * y)) + ((0.1 * x) * y)) + (0.2 * Math.sqrt(Math.abs(x)));
    num += (((20.0 * Math.sin((6.0 * x) * ins.pi)) + (20.0 * Math.sin((2.0 * x) * ins.pi))) * 2.0) / 3.0;
    num += (((20.0 * Math.sin(y * ins.pi)) + (40.0 * Math.sin((y / 3.0) * ins.pi))) * 2.0) / 3.0;
    return (num + ((((160.0 * Math.sin((y / 12.0) * ins.pi)) + (320.0 * Math.sin((y * ins.pi) / 30.0))) * 2.0) / 3.0));
  }
  ins.transformLon = function (x, y) {
    var num = ((((300.0 + x) + (2.0 * y)) + ((0.1 * x) * x)) + ((0.1 * x) * y)) + (0.1 * Math.sqrt(Math.abs(x)));
    num += (((20.0 * Math.sin((6.0 * x) * ins.pi)) + (20.0 * Math.sin((2.0 * x) * ins.pi))) * 2.0) / 3.0;
    num += (((20.0 * Math.sin(x * ins.pi)) + (40.0 * Math.sin((x / 3.0) * ins.pi))) * 2.0) / 3.0;
    return (num + ((((150.0 * Math.sin((x / 12.0) * ins.pi)) + (300.0 * Math.sin((x / 30.0) * ins.pi))) * 2.0) / 3.0));
  }
  ins.bd_encrypt = function (gg_lat, gg_lon) {
    var lat = {Lat: gg_lat, Lng: gg_lon};
    var x = gg_lon;
    var y = gg_lat;
    var num3 = Math.sqrt((x * x) + (y * y)) + (2E-05 * Math.sin(y * ins.x_pi));
    var d = Math.atan2(y, x) + (3E-06 * Math.cos(x * ins.x_pi));
    lat.Lng = ins.formatLngLat((num3 * Math.cos(d)) + 0.0065);
    lat.Lat = ins.formatLngLat((num3 * Math.sin(d)) + 0.006);
    return lat;
  }
  ins.formatLngLat = function (gg_val) {
    return Math.floor(gg_val * 1000000) / 1000000.0;
  }
  ins.Wgs84ToGoogle = function (wgLat, wgLon) {
    return ins.Transform(wgLat, wgLon);
  }
//还原
  ins.generateDistance = function (point) {
    return ins.computeDistance(point.Lng, point.Lat, point.ExcursionLng, point.ExcursionLat);
  }
  ins.computeDistance = function (lon1, lat1, lon2, lat2) {
    var EARTH_RADIUS = 6378137;
    var radLat1 = ins.getRad(lat1);
    var radLat2 = ins.getRad(lat2);
    var a = radLat1 - radLat2;
    var b = ins.getRad(lon1) - ins.getRad(lon2);
    var s = 2 * Math.sqrt(Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(radLat1)
        * Math.cos(radLat2) * Math.sin(b / 2) * Math.sin(b / 2));
    s = s * EARTH_RADIUS;
    return s;
  }
  ins.getRad = function (d) {
    return d * Math.PI / 180;
  }
  ins.generateAreaPoint = function (point, d, num, maptype) {
    var points = [];
    for (var i = 0; i < num; i++) {
      var gpsPoint = {
        Lng: (d * Math.cos(Math.PI / num * i) + point.Lng),
        Lat: (d * Math.sin(Math.PI / num * i) + point.Lat)
      };
      var tmppoi = null;
      if (maptype == 'baidu') {
        tmppoi = ins.Wgs84ToBd09(gpsPoint.Lat, gpsPoint.Lng);
      } else if (maptype == 'google') {
        tmppoi = ins.Wgs84ToGoogle(gpsPoint.Lat, gpsPoint.Lng);
      }
      gpsPoint.ExcursionLng = tmppoi.Lng;
      gpsPoint.ExcursionLat = tmppoi.Lat;
      points.push(gpsPoint);
    }
    return points;
  }
//type为1是百度，其它为谷歌
  ins.recovery = function (gpsPoint, maptype) {
    var point = null;
    if (maptype == 'baidu')
      point = ins.Wgs84ToBd09(gpsPoint.Lat, gpsPoint.Lng);
    else
      point = ins.Wgs84ToGoogle(gpsPoint.Lat, gpsPoint.Lng);
    var refPoint = {Lat: gpsPoint.Lat, Lng: gpsPoint.Lng, ExcursionLat: point.Lat, ExcursionLng: point.Lng};
    var points = ins.generateAreaPoint(refPoint, (ins.generateDistance(refPoint)) / 100000.0, 12, maptype);
    var d = 0;
    for (var j = 0; j < points.length; j++) {
      var dd = ins.computeDistance(gpsPoint.Lng, gpsPoint.Lat, points[j].ExcursionLng, points[j].ExcursionLat);
      if (j == 0 || dd < d) {
        d = dd;
        refPoint = points[j];
      }
    }
    var rx = refPoint.ExcursionLng - refPoint.Lng;
    var ry = refPoint.ExcursionLat - refPoint.Lat;
    gpsPoint.Lng = ins.formatLngLat(gpsPoint.Lng - rx);
    gpsPoint.Lat = ins.formatLngLat(gpsPoint.Lat - ry);
    return gpsPoint;
  }

  return ins;
})(window);
//var tttt = _Wars2WgsByAlgorithm.Wgs84ToBd09(22.536125, 114.130906);
//var pppp = _Wars2WgsByAlgorithm.recovery({ Lng: tttt.Lng, Lat: tttt.Lat }, 'baidu');
//alert('114.130906,22.536125==\r\n' + tttt.Lng.toString() + '---' + tttt.Lat.toString() + '==\r\n' + pppp.Lng.toString() + '---' + pppp.Lat.toString());
