/**
 * Created by rocky on 2015/6/16.
 *
 * @description APP配置信息、URL配轩信息、基本配置信息放到这里
 *
 **/

/********************************/
/************ 基本信息: ***********/
/********************************/
var APP_VERSION = "1.0.0"; 											//当前版本
var App_Publish = "2015-10-20";										//发布日期

var API_appkey = "100000051"; 										//API 智能007 Appkey
var API_secret = "39CC40FFB623C2C5";								//API 智能007 secret

var API_appserverurl = 'http://joinapi.zgjshop.com';					//APP数据服务器地址
var API_smsserverurl = 'http://joinapi.zgjshop.com'; 				//短信服务器地址
var API_imgbaseurl = 'http://join.zgjshop.com';

// var API_appserverurl = 'http://localhost:1558';
// var API_smsserverurl = 'http://localhost:1558';
// var API_imgbaseurl = 'http://localhost:1558';

var API_webserverurl = 'http://join.zgjshop.com'; 						//WEB服务器地址

//var tmpdomain = document.domain;
//if(_.isString(tmpdomain) && (tmpdomain.indexOf('192.168.') == 0 ||
//tmpdomain.indexOf('localhost') == 0 || tmpdomain.indexOf('127.0.0.1') == 0)){
//API_appserverurl = 'http://'+tmpdomain+':1558';				//APP数据服务器地址
//API_smsserverurl = 'http://'+tmpdomain+':1558'; 				//短信服务器地址
//API_webserverurl = 'http://'+tmpdomain+':1557'; 						//WEB服务器地址
//// API_imgbaseurl = 'http://'+tmpdomain+':1557';
//}
//console.log('tmpdomain:' + tmpdomain);
console.log('API_appserverurl:' + API_appserverurl);
var mqUrl = API_appserverurl;

var ubiId = 10000002;//学校ID
var uuiId = 0;//用户ID
var islogined = true;

var sponsor=10000200;//主办方
var activityCategory=10000100;//活动标签
var organizer=10000400;//承办方
var honorCategory=10000500;//荣誉类别

var default_activityList = "./img/my_list_default.png"//活动的默认图片

///系统配置环境
var sysConfigData = {
  //全局参数定义
  sys:{
    mq: {
      isfirstsub: true,//是否初次订阅
      client_id: '',//客户端链路ID
      ticket: ''//中科大注册授权
    }
  },
  //消息设置
  message_autoPush:true,//默认启动推送通过
  message_autoSound:true,//默认启动声音提示
  message_autoVibrate:true,//默认启动振动提示
  message_Set:1,//消息免打扰设置，0关闭, 1开启，2只在夜间开启
//基本设置
  base_autoReceiver :1,//默认启动听筒模式
  base_autoLocation:1,//默认启动自动更新定位


  autoLogin: true,//默认自动登录

  notification: {
    msgAllcount: 0, //推送消息总数
    sysMsgCount: 0,  //系统消息数
    activityNoticeCount: 0,//活动提醒消息数
    sysNoticeCount: 0//官方通知消息数
  }
};
/********************************/
/********* Dev环境: **************/
/********************************/
//...


/********************************/
/********* 正式环境: **************/
/********************************/
//...


/********************************/
/******* 默认配置信息，不需要更改: ****/
/********************************/
// var DefaultPic = "/upload/"+API_appkey+"/shared/zn007_150_150.png";	//默认分享图片URL，没图片时用
//var DB_USERINFO_KEY = "USER_INFO";									//用户信息Key（Cache）
//var DB_MENU_CATEGORY = "DB_MENU_CATEGORY";							//产品分类Key（Cache）
//var DB_USERLOGININFO = "DB_JIZHU_USERINFO";                        //记住账号和密码
//var DB_OTHERLOGIN = "DB_OTHERLOGIN";                                //记住第三方登录信息

/********************************/
/********* 枚举信息:  *************/
/********************************/

/**
 * @description  1.	错误编码
 */
var RpcErrorCodes = {
	0: '成功',
	1100: '用户不存在', //获取验证码时，电话号码不存在返回的错误信息
	1101: '电话号码不唯一',
	1102: '用户已过期',
	1103: '验证码错误',
	1104: '验证码已超时',
	1105: '用户已失效', //（原token已过期+token不存在+用户已过期）
	1106: '登录已过期', //Token已过期
	1110: '接口不存在',
	1120: '数据库错误',
	1130: '未知错误'
};
/**
 * 一个小时的毫秒数
 */
var HOUR = 1 * 1000 * 60 * 60;

