/********************************/
/********* 微信环境: **************/
/********************************/
var isWeb = true;

if (isWeb){

  /**
   * @description 写入一个对象 Key，Value
   */
  db.add = function(key, value) {
    if (isWeb)
    {
      val = JSON.stringify(value);
      localStorage.setItem(key,val);
    }
    else if (window.plus && plus.storage && plus.storage.setItem) {
      val = JSON.stringify(value);
      plus.storage.setItem(key, val);
    }

  };

  /**
   * @description 获取一个对象，key
   */
  db.get = function(key) {
    if (isWeb)
    {
      try{
        var url_ = window.location.href.split("?");
        var urlLength = url_.length;
        var vas ={};
        if(urlLength>2){//url中带参数
          var parameter = url_[urlLength-1].split("&");
          for(p in parameter){
            var val  = parameter[p].split("=");
            var tempVal={};
            tempVal[val[0]] = val[1];
            $.extend(vas,tempVal);
          }
          var tmepKey = url_[urlLength-2].split("/");
          var db_key = tmepKey[tmepKey.length-1]+"_url";
          db.add(db_key,vas);
          return vas;
        }else{
          var val = localStorage.getItem(key);
          if (val)
            return JSON.parse(val);
        }
      }catch(e){
        printError('db.get param='+val);
      }
    }
    else if (window.plus && plus.storage && plus.storage.getItem) {

      try{
        var val = plus.storage.getItem(key);
        if (val)
          return JSON.parse(val);
      }catch(e){
        printError('db.get param='+val);
      }

    }

    return null;
  };

  db.saveCaller = function(caller, data){
    var key = JSON.stringify(caller);
    db.add(key, data);
  };

  db.getCaller = function (caller) {
    var key = JSON.stringify(caller);
    var val = db.get(key);
    return val;
  };



  /**
   * @description 删除一个对象，Key
   */
  db.del = function(key) {
    if (isWeb) {
      localStorage.removeItem(key);
    } else if (window.plus && plus.storage)
      plus.storage.removeItem(key);

  };

  db.remove = function (key) {
    db.del(key);
  };
  /**
   * @description 清除所有数据
   */
  db.clearall = function() {
    if (isWeb)
      localStorage.clear();
    else if (window.plus)
      plus.storage.clear();

  };

  db.getAllKeys = function () {
    if (window.plus && !isWeb)
    {
      var keyNames = [];
      var numKeys=plus.storage.getLength();
      for(var i=0; i<numKeys; i++) {
        keyNames[i] = plus.storage.key(i);
      }
      return keyNames;
    }
  };


  /**
   * @description 更新一个对象
   */
  db.update = function(key, value) {
    if (window.plus || !isWeb) {
      db.add(key, val);
    }
  };

  /** @description 关闭启动图片*/
  zn.closeSplashscreen = function() {
  	console.log('未实现');
  };

  /** @description 显示自动隐藏的提示（系统） */
  zn.showToast = function(txt) {
  	console.log('未实现');
  };

  /**
   * @description 显示网络错误
   */
  zn.ShowNetworkError = function() {
		console.log('未实现');
  };

}

