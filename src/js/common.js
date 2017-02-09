/**
 * Created by rocky on 2015/6/16.
 *
 * @description 功能、方法、函数都放到这个文件
 *
 **/



var infoBox, infoBoxTimeoutId, LoadingBox;

/**
 * @description 打印带时间的LOG
 */
function printLog(txt) {
	var d = new Date();
	console.log('[' + moment().format('YYYY-MM-DD hh:mm:ss SSS') + '] [' + document.title + '] ' + txt);
}

function printError(txt) {
	var d = new Date();
	console.error('[' + moment().format('YYYY-MM-DD hh:mm:ss SSS') + '] [' + document.title + '] ' + txt);
	console.trace();
}

/*
 * 显示Loading,
 * , 请使用zn.showWaiting(), 请使用zn.showWaiting(), 请使用zn.showWaiting()
 */
function showLoading() {
	return;
	if (!LoadingBox)
		LoadingBox = $('.loading')[0];
	LoadingBox.style.visibility = 'visible';
	LoadingBox.classList.remove('aHide');
	LoadingBox.classList.add('aShow');
}

/*
 * 隐藏Loading
 * 请使用zn.hideWaiting(), 请使用zn.hideWaiting(), 请使用zn.hideWaiting()
 */
function hideLoading() {
	return;
	if (!LoadingBox)
		LoadingBox = $('.loading')[0];
	setTimeout(function() {
		LoadingBox.classList.remove('aShow');
		LoadingBox.classList.add('aHide');
	}, 0);
}

/*
 * 显示信息框(WEB)
 * */
function showInfoBox(info_txt) {
	printLog(info_txt);
	//return;

	$('.ht-info-text').html(info_txt);
	if (!infoBox)
		infoBox = $('.ht-info-box')[0];
	infoBox.style.visibility = 'visible';
	infoBox.classList.remove('aHide');
	infoBox.classList.add('aShow');
	if (infoBoxTimeoutId) {
		clearTimeout(infoBoxTimeoutId);
		infoBoxTimeoutId = undefined;
	}
	infoBoxTimeoutId = setTimeout(function() {
		infoBox.classList.remove('aShow');
		infoBox.classList.add('aHide');
		infoBoxTimeoutId = undefined;
	}, 3000);
}

/*
 * 显示成功提示框
 * */
function showSuccess(txt) {
	if (!txt)
		return;
	zn.showToast(txt);
	//return;
	//showInfoBox('<span class="txt-success">'+txt+'</span>');
}

/*
 * 显示错误框
 * */
function showError(txt) {
	if (!txt)
		return;
	zn.showToast(txt);
	//return;
	//showInfoBox('<span class="txt-error">'+txt+'</span>');
}

/*
 * 显示信息提示框
 * */
function showInfo(txt) {
	showSuccess(txt);
}


function postDataTransform(data) {
	if (!data)
		return null;
	return $.param(data);
}

var isAjaxToIO = false;

function httpSend(type, http, url, model, title, successCB, errorCB, isNotShowMsg) {
	model = angular.extend({
		ubiId: ubiId ? ubiId : 0
	}, model);
	var _send = angular.noop;
	var _title = title || '';
	var _isNotShowMsg = isNotShowMsg || false;
	var option = {
		withCredentials: true,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		transformRequest: postDataTransform
	};
	switch (type) {
		case 'post':
			_send = http.post;
			break;
		case 'delete':
			_send = http.delete;
			break;
		case 'put':
			_send = http.put;
			break;
		case 'get':
		default:
			delete option.transformRequest;
			_send = http.get;
	}
	//var _successCB = successCB;
	//var successCB = function (data) {
	//  setTimeout(function () {
	//    _successCB(data);
	//  },0);
	//};
	showLoading();
	_send.call(http, url, model, option).success(function(data) {
		hideLoading();
		if (data.hasOwnProperty('code')) {
			if (data.code == 0) {
				if (!_isNotShowMsg) {
					showInfo(data.message); //showInfo(_title+'成功 '+data.message);
				}
				if (successCB)
					successCB(data.data);
			} else {
				if (!_isNotShowMsg) {
					showError(data.message); //showError(_title+'失败 '+data.message);
				}
				console.error(data.message);
				if (errorCB)
					errorCB(data);
				return;
			}
		} else {
			if (!_isNotShowMsg) {
				showInfo(data.message); //showInfo(_title+'成功 '+data.message);
			}
			if (successCB)
				successCB(data);
		}

	}).error(function(err, statusCode) {

		if (statusCode == 401) {
			showError(err);
			setTimeout(function() {
				self.location = '/page/main/index#/login';
			}, 3000);
			return;
		}
		hideLoading();
		var errMsg = angular.isObject(err) ? (err.message ? err.message : err.summary) : err;
		if (!_isNotShowMsg) {
			showError(errMsg); //showError(_title+'失败 '+errMsg);
		}
		console.error(errMsg);
		if (errorCB)
			errorCB(err);
	});
}

function ioSend(type, url, model, title, successCB, errorCB, isNotShowMsg) {
	model = angular.extend({
		ubiId: ubiId ? ubiId : 0
	}, model);
	var _iosend = angular.noop;
	var scope = this;
	var _title = title || '';
	var _isNotShowMsg = isNotShowMsg || false;
	switch (type) {
		case 'post':
			_iosend = mq.sails.post;
			break;
		case 'delete':
			_iosend = mq.sails.delete;
			break;
		case 'put':
			_iosend = mq.sails.put;
			break;
		case 'get':
		default:
			_iosend = mq.sails.get;
	}
	showLoading();
	_iosend.call(mq.sails, url, model, function(data, jwr) {
		hideLoading();
		if (jwr.statusCode == 401) {
			showError(data);
			setTimeout(function() {
				self.location = '/page/main/index#/login';
			}, 3000);
			return;
		}
		if (jwr.statusCode != 200) {
			//    var errMsg = angular.isString(data) ? data : data.message;//err.message ? err.message : err.summary;
			//    var msg = errMsg;//title + '失败 ' + errMsg;
			//    if (!_isNotShowMsg) {
			//      showError(msg);
			//    }
			//    console.error(msg);
			if (errorCB)
				errorCB(data, jwr);
			return;
		}
		if (data.hasOwnProperty('code')) {
			if (data.code == 0) {
				if (!_isNotShowMsg) {
					showInfo(data.message); //showInfo(_title+'成功 '+data.message);
				}
				if (successCB)
					successCB(data.data, jwr);
			} else {
				if (!_isNotShowMsg) {
					showError(data.message); //showError(_title+'失败 '+data.message);
				}
				console.error(data.message);
				if (errorCB)
					errorCB(data, jwr);
				return;
			}
		} else {
			if (!_isNotShowMsg) {
				showInfo(data.message); //showInfo(_title+'成功 '+data.message);
			}
			if (successCB)
				successCB(data, jwr);
		}

		if (scope && scope.$digest) {
			console.log('ioSend scope.$digest();');
			scope.$digest();
		}
	});
}

/*
 * 提交Post到URL mq.sails
 * @http http对象
 * @url 发送到的地址
 * @model 要发送的数据
 * @title 收发提示的标题
 * @successCB 成功回调
 * @errorCB 错误回调
 * */
function ajaxPost(http, url, model, title, successCB, errorCB, isNotShowMsg) {
	if (isAjaxToIO && mq.isConnected) {
		ioSend.call(this, 'post', url, model, title, successCB, errorCB, isNotShowMsg);
		return;
	}
	httpSend.call(this, 'post', http, url, model, title, successCB, errorCB, isNotShowMsg);
}

/* 提交delete到URL
 * @http http对象
 * @url 发送到的地址
 * @model 要发送的数据
 * @title 收发提示的标题
 * @successCB 成功回调
 * @errorCB 错误回调
 */
function ajaxDelete(http, url, model, title, successCB, errorCB, isNotShowMsg) {
	title = '删除' + title;
	if (isAjaxToIO && mq.isConnected) {
		ioSend.call(this, 'delete', url, model, title, successCB, errorCB, false);
		return;
	}
	httpSend.call(this, 'delete', http, url, model, title, successCB, errorCB, false);
}

/* 提交get到URL
 * @http http对象
 * @url 发送到的地址
 * @model 要发送的数据
 * @title 收发提示的标题
 * @successCB 成功回调
 * @errorCB 错误回调
 */
function ajaxGet(http, url, model, title, successCB, errorCB, isNotShowMsg) {
	if (isAjaxToIO) {
		ioSend.call(this, 'get', url, model, title, successCB, errorCB, isNotShowMsg);
		return;
	}
	httpSend.call(this, 'get', http, url, model, title, successCB, errorCB, isNotShowMsg);
}

/*提交put到URL
 * @http http对象
 * @url 发送到的地址
 * @model 要发送的数据
 * @title 收发提示的标题
 * @successCB 成功回调
 * @errorCB 错误回调
 * */
function ajaxPut(http, url, model, title, successCB, errorCB, isNotShowMsg) {
	if (isAjaxToIO && mq.isConnected) {
		ioSend.call(this, 'put', url, model, title, successCB, errorCB, false);
		return;
	}
	httpSend.call(this, 'put', http, url, model, title, successCB, errorCB, false);
}

/*
 * 删除前的确认
 * */
function showConfirm(msg, CB) {
	BootstrapDialog.confirm({
		type: BootstrapDialog.TYPE_INFO,
		title: '消息',
		message: msg,
		closable: false,
		draggable: false,
		btnCancelLabel: '取消',
		btnOKLabel: '确　定',
		btnOKClass: 'btn-E51F79',
		callback: function(result) {
			if (result) {
				CB && CB();
			}
		}
	});
}
//================== debug =================
/*
 * 替换字符串
 * */
String.prototype.replaceAll = function(pattern, replaceValue) {
	replaceValue = replaceValue || '';
	if (this.replace) {
		return this.replace(new RegExp(pattern, "gm"), replaceValue);
	} else
		return "";
};


function htmlDecode(value) {
	if (value) {
		return $('<div />').html(value).text();
	} else {
		return '';
	}
}

/*
 * 删除前后空格
 * */
String.prototype.Trim = function() {
	if (this.match) {
		var m = this.match(/^\s*(\S+(\s+\S+)*)\s*$/);
		return (m == null) ? "" : m[1];
	} else
		return "";
};

//加法
Number.prototype.add = function(arg) {
	var r1, r2, m;
	try {
		r1 = this.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2))
	return (this * m + arg * m) / m
}

//减法
Number.prototype.sub = function(arg) {
	return this.add(-arg);
}

//乘法
Number.prototype.mul = function(arg) {
	var m = 0,
		s1 = this.toString(),
		s2 = arg.toString();
	try {
		m += s1.split(".")[1].length
	} catch (e) {}
	try {
		m += s2.split(".")[1].length
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

//除法
Number.prototype.div = function(arg) {
		var t1 = 0,
			t2 = 0,
			r1, r2;
		try {
			t1 = this.toString().split(".")[1].length
		} catch (e) {}
		try {
			t2 = arg.toString().split(".")[1].length
		} catch (e) {}
		with(Math) {
			r1 = Number(this.toString().replace(".", ""))
			r2 = Number(arg.toString().replace(".", ""))
			return (r1 / r2) * pow(10, t2 - t1);
		}
	}
	/*
	 * 格式化数字，保留fix位小数
	 * */
Number.prototype.format = function(fix) {
	re = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
	return this.toFixed(fix).replace(re, "$1,");
};
/*
 * 格式化金额
 * */
Number.prototype.ToMoney = function(fixed) {
	if (isNaN(fixed))
		fixed = 2;
	var ret = this.format(fixed) + "";
	var indexsub = ret.indexOf("-");
	return (indexsub < 0 ? "￥" : "-￥") + ret.replace("-", "");
};
/*
 * 格式化百分比
 * */
Number.prototype.ToPercent = function(fixed) {
	if (isNaN(fixed))
		fixed = 3;
	return this.format(fixed) + '%';
};

/*
 * 日期格式化
 * */
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

// return -$1,000
function int2Money(value) {
	if (isNaN(value))
		value = 0;
	if (value == '-')
		return value;
	var fix = value >= 0 ? "￥" : "-￥";

	return fix + "" + Number(value).format(0).replace("-", "");
}

// return -1000
function money2Int(txt) {
	if (isNULL(txt))
		return '';
	if (txt == '-')
		return txt;

	return parseInt(txt.replace("￥", "").replaceAll(",", "").replace(" ", ""));
}

// return -$1,000.31
function Number2Money(value, fixed) {

	if (isNaN(value))
		value = 0;
	if (value == '-')
		return value;
	var fix = value >= 0 ? "￥" : "-￥";

	if (isNULL(fixed) || isNaN(fixed))
		fixed = 2;

	return fix + "" + Number(value).format(fixed).replace("-", "");
}

// return -1000.31
function Money2Number(txt) {
	if (isNULL(txt))
		return '';
	if (txt == '-')
		return txt;

	return parseFloat(txt.replace("￥", "").replaceAll(",", "").replace(" ", ""));
}

// return 3.456%
function Number2Percent(value, fixed) {
	if (isNaN(value))
		value = 0;
	if (value == '-')
		return value;
	var fix = "%";

	if (isNULL(fixed) || isNaN(fixed))
		fixed = 3;

	return Number(value).format(fixed) + fix;
}

// return 3.456
function Percent2Number(txt) {
	if (isNULL(txt))
		return '';
	if (txt == '-')
		return txt;

	return parseFloat(txt.replace("%", "").replaceAll(",", "").replace(" ", ""));
}

/*
 * 判断是否空对象
 * */
function isNULL(value) {
	if (value == null || value == undefined || value == '')
		return true;
	return false;
}
/*
 * obj是否未Object类型
 * */
function isObject(obj) {
	return typeof obj == "object"
}
//
//================== debug =================
/*
 * 表单错误提示
 * */
function showFormErrorList() {
	setTimeout(function() {
		var errList = $('.has-error label'); //.text();//.replaceAll('\r', ' ');
		var errTitle = '';
		for (var i = 0; i < errList.length; i++) {
			var tmp = errList[i];
			errTitle += $(tmp).text() + ',&nbsp;';
		}
		showInfo('请填写项目: ' + errTitle);
	}, 100);
}

//判断复选框是否选中
function isCheckSelected(id) {
	return $("#" + id)[0].checked;
}

/*
 * 输出aliyun图片URL
 * @param relative_url 数据库中的相对路径
 * @param size 尺寸(宽度，高度自适应)
 * */
function formatImgUrl(relative_url, size) {
	if (!relative_url || relative_url.length == 0)
		relative_url = API_imgbaseurl;
	if (relative_url) {
		if (relative_url.indexOf('.') == 0)
			return relative_url;
		var _size = size || 32;
		var _imgBaseurl = API_imgbaseurl || '';
		_imgBaseurl += relative_url; // + '@' + _size + '_1l';

		//    if (_imgBaseurl.indexOf('oss-cn-shenzhen.aliyuncs.com') > -1)
		//      return _imgBaseurl + '@' + _size + 'w_1l';
		return _imgBaseurl;
	}
	return '';
}

function getHomeUrl() {
	if (window.hasOwnProperty('homeUrl') && homeUrl && homeUrl.length > 0)
		return homeUrl;

	if (window.hasOwnProperty('API_baseurl') && API_baseurl && API_baseurl.length > 0)
		return API_baseurl + "?sbiId=" + sbiId;

	return "http://" + self.location.host + "?sbiId=" + sbiId;
}

/**
 * 输出aliyun图片URL
 * @param dbImgUrl 数据库中图片的路径
 */
function formatDbImgUrl(dbImgUrl, size) {

	if (!dbImgUrl || dbImgUrl.length == 0)
		dbImgUrl = default_activityList;
	if (dbImgUrl.indexOf('http://') >= 0)
		return dbImgUrl;

	var _imgBaseurl = API_imgbaseurl || '';
	if (!dbImgUrl || dbImgUrl.length == 0 || dbImgUrl.Trim() == '')
		return formatImgUrl(dbImgUrl, size);

	var images = dbImgUrl.split(",");

	if (images.length > 0)
		dbImgUrl = images[0];

	return formatImgUrl(dbImgUrl, size);
}

/*图片旋转到正确方向*/
function getImgOrientation(file, callback) {
	var reader = new FileReader();
	reader.onload = function(e) {

		var view = new DataView(e.target.result);
		if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
		var length = view.byteLength,
			offset = 2;
		while (offset < length) {
			var marker = view.getUint16(offset, false);
			offset += 2;
			if (marker == 0xFFE1) {
				if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
				var little = view.getUint16(offset += 6, false) == 0x4949;
				offset += view.getUint32(offset + 4, little);
				var tags = view.getUint16(offset, little);
				offset += 2;
				for (var i = 0; i < tags; i++)
					if (view.getUint16(offset + (i * 12), little) == 0x0112)
						return callback(view.getUint16(offset + (i * 12) + 8, little));
			} else if ((marker & 0xFF00) != 0xFF00) break;
			else offset += view.getUint16(offset, false);
		}
		return callback(-1);
	};
	reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
}

/*
 * API Timestamp
 * */
function getTimestamp() {
	//var d = new Date();
	//var ret = d.format("yyyyMMddhhmmss");
	var ret = moment().format("YYYYMMDDHHmmss");
	return ret;
}

//API接口的MD5， tn：时间戳
function getMd5(API_appkey, tn, API_secret) {
	var txt = "appkey" + API_appkey + "timestamp" + tn + "" + API_secret + "";
	var md5 = hex_md5(txt);
	//printLog("txt="+txt);
	//printLog("md5="+md5);
	return md5.toUpperCase();
}

function formatAesKey(key) {
	var len = key.length;
	var maxLen = 16;
	var buffer = '';

	for (var i = 0; i < (maxLen - len); i++) {
		buffer += "0";
	}
	return key + buffer;
}

//AES加密，API传送用户名、密码等需要加密
function getAESCode(txt, appkey) {
	return txt; //现在不加密
	var k = formatAesKey(appkey);
	return aesEncrypt(txt, k, '');
}


/**
 * 格式化银行卡卡号
 */
function formatBankCardNum(cardNum) {
	var result = "";
	if (!isNaN(cardNum.replace(/[ ]/g, ""))) {
		//四位数字一组，以空格分割
		result = cardNum.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
	}
	return result;
}

//退出登陆，清除用户信息
function userLogout() {
	db.remove(DB_USERINFO_KEY);
}

//获取用户信息
function getUserInfo() {
	return db.get(DB_USERINFO_KEY) || {};
}

function isUserLogin() {
	var u = getUserInfo();
	//var status = (u == null ? false : true);

	return u.hasOwnProperty('token');
}

//获取TOKEN
function getToken() {
	var info = getUserInfo();
	if (info == null)
		return "";
	return info.token;
}

//获取请求API的对象
function getAPIObject(obj) {
	var tn = getTimestamp();
	var data = {
		appkey: API_appkey,
		timestamp: tn,
		digest: getMd5(API_appkey, tn, API_secret),
		token: getToken()
	};
	if (obj != undefined && obj != null)
		$.extend(data, obj);

	printLog("getAPIObject" + JSON.stringify(data));
	return data;
}
//判断为空
function isEmpty(obj) {
	obj = $.trim(obj);
	return obj == undefined || obj == null || obj.toString() == '';
}
//判断不为空
function isNotEmpty(obj) {
	obj = $.trim(obj);
	return obj != undefined && obj != null && obj.toString() != '';
}

//强制刷新指定页面
function reloadPage(pageName) {
	var wobj = plus.webview.getWebviewById(pageName);
	wobj.reload(true);
}

/*
 * 生成分享图片的URL
 \upload\{AppId}\shared\{图片名­}_150_150
 \upload\{AppId}\shared\{图片名­}_150_150.png
 http://bdevcloud.vpclub.cn/upload/100000051/201510/09/201510091854464438.Png
 http://bdevcloud.vpclub.cn/upload/100000051/shared/201510/09/201510091854464438_150_150.Png
 * */
// function getShareUrl(picUrl) {
//   if (!picUrl || picUrl == '')//没有图片，直接返回默认的
//     return API_pictureurl + DefaultPic;
//
//   var picNames = picUrl.split(API_appkey + "/");//切URL，只取图片名部分
//
//   if (picNames.length < 2)
//     return API_pictureurl + DefaultPic;//切不开，返回默认分享图
//
//   var picName = picNames[1];//取有效部分
//   var pointIndex = picName.lastIndexOf('.');//取扩展名分隔符
//   var picBase = picName.substring(0, pointIndex);//取到图片基本名
//   var extName = picName.substring(pointIndex, picName.length);//取到扩展名
//   var sharePicUrl = API_pictureurl + '/upload/' + API_appkey + '/shared/' + picBase + '_150_150' + extName;//分享图片
//   return sharePicUrl;
// }
/**
 * @description  格式化金钱，先四舍五入，再输出
 * */
function formatMoney(val) {
	var tmpMoney = Math.round(val * 100) / 100;
	return tmpMoney;
}


/**
 * @description  审核状态
 * @constructor
 * @param {string} url 访问接口的url
 * @return {string} 带baseurl的新url
 */
function isAppStoreAuditing(url) {
	//	var user = getUserInfo();
	//	var osName = plus.os.name;
	//	//18816816888 storeMasterId	5002631
	//	if((osName == "iOS" && user.storeMasterId == null) || user.storeMasterId == 5002631)
	//     return API_baseurl+url;

	return API_baseurl + url;
}

function formatMoney(money) {
	return parseFloat(money);
	//	return tmp.toFixed(0);

}

function randomcode(size) {
	size = size || 6;
	var code_string = '0123456789';
	var new_pass = '';
	while (size > 0) {
		new_pass += code_string.charAt(Math.floor(Math.random() * 10));
		size--;
	}
	return new_pass;
}

function GenSerialNumber(opt, startno) {
	var code = '';
	if (!_.isUndefined(opt.orderType)) {
		switch (opt.orderType) {
			case 0:
				code += '1';
				break;
			case 1:
				code += '2';
				break;
			case 2:
				code += '3';
				break;
			case 3:
				code += '4';
				break;
			case 4:
				code += '5';
				break;
			case 5:
				code += '6';
				break;
			default:
				code += '9';
				break;
		}
		code += moment().format('YYMMDD') + _.parseInt(_.parseInt(moment().diff(moment().startOf('day'))) / 1000).toString();

		if (_.isString(startno) && startno != null && startno.length > 3)
			code += startno.substring(startno.length - 4);
		else
			code += randomcode(4);
	}
	return code;
}


/*时间友好性格式化*/
function hommizationTime(dateTimeStamp) {
	var targetTime = new Date(dateTimeStamp);
	var result;
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if (diffValue < 0) {
		//非法操作
		//结束日期不能小于开始日期
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;

	if (monthC >= 1) {
		result = "" + targetTime.format('yyyy-MM-dd hh:mm');
	} else if (weekC >= 1) {
		result = "" + targetTime.format('yyyy-MM-dd hh:mm');
	} else if (dayC >= 3) {
		result = "" + targetTime.format('yyyy-MM-dd hh:mm');
	} else if (dayC >= 2) {
		result = "前天 " + targetTime.format('yyyy-MM-dd hh:mm');
	} else if (dayC >= 1) {
		result = "昨天 " + targetTime.format('yyyy-MM-dd hh:mm');
	} else
		result = "今天" + targetTime.format('yyyy-MM-dd hh:mm');
	return result;
}

/**
 * @description 停止事件冒泡
 */
function stopEvent(event) {
	if (event.stopImmediatePropagation) {
		event.stopImmediatePropagation();
	} else {
		// Part of the hack for browsers that don't support Event#stopImmediatePropagation
		event.propagationStopped = true;
	}
	event.stopPropagation();
	event.preventDefault();
	return false;
}


/** @description 格式化数字 */
function formatNumber(value, unit, fixed) {
	var val = Number(value);
	if (!isFinite(val))
		return '--';
	if (!isFinite(fixed))
		fixed = 2;
	return val.toFixed(fixed);
}



//检查手机号格式
function CheckPhoneFormat(val) {
	var patter = /((^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$)/;
	if (!patter.test(val)) {
		return false;
	}
	return true
}

//身份证格式校验
function IdentityCodeValid(code) {
	var pass = true;

	if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
		pass = false;
	} else if (_.indexOf(["11", "12", "13", "14", "15", "21", "22", "23", "31", "32", "33", "34", "35", "36", "37", "41", "42", "43", "44", "45", "46", "50", "51", "52", "53", "54", "61", "62", "63", "64", "65", "71", "81", "82", "91"], code.substr(0, 2)) == -1) {
		pass = false;
	} else {
		//18位身份证需要验证最后一位校验位
		if (code.length == 18) {
			code = code.split('');
			//∑(ai×Wi)(mod 11)
			//加权因子
			var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
			//校验位
			var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
			var sum = 0;
			var ai = 0;
			var wi = 0;
			for (var i = 0; i < 17; i++) {
				ai = code[i];
				wi = factor[i];
				sum += ai * wi;
			}
			var last = parity[sum % 11];
			if (parity[sum % 11] != code[17]) {
				pass = false;
			}
		}
	}
	return pass;
}
//邮件格式校验
function EmailValid(str) {
	if (str) {
		var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		return reg.test(str);
	} else {
		return false;
	}
}
/// <summary>
/// 计算两点间的距离
/// </summary>
/// <param name="lng1">开始经度</param>
/// <param name="lat1">开始纬度</param>
/// <param name="lng2">结束经度</param>
/// <param name="lat2">结束纬度</param>
/// <returns>两点间距离</returns>
function AnalyseDistance(lng1, lat1, lng2, lat2) {
	var rad = Math.PI / 180.0;
	var radLat1 = rad * lat1;
	var radLat2 = rad * lat2;
	var a = radLat1 - radLat2;
	var b = rad * lng1 - rad * lng2;
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
		Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = Math.floor(s * 6378137);
	if (s < 50)
		return '< 50米';
	if (s < 1000)
		return s + '米';
	if (s >= 1000)
		return (Math.floor(s / 100.0) / 10.0) + '千米';

	return s;
}

/**
 * 纬度到像素Y
 */
function latToPixel(lat, zoom )
{
  zoom = zoom ? zoom : 18;
  var siny = Math.sin(lat * Math.PI / 180);
  var y = Math.log((1 + siny) / (1 - siny));
  return (128 << zoom) * (1 - y / (2 * Math.PI));

}

/**
 * 像素Y到纬度
 */
function pixelToLat(pixelY, zoom)
{
  zoom = zoom ? zoom : 18;
  var y = 2 * Math.PI * (1 - pixelY / (128 << zoom));

  var z = Math.pow(Math.E, y);

  var siny = (z - 1) / (z + 1);

  return Math.asin(siny) * 180 / Math.PI;

}

/**
 * 经度到像素X值
 */
function lngToPixel(lng, zoom)
{
  zoom = zoom ? zoom : 18;
  return (lng + 180) * (256 << zoom) / 360;

}

/**
 * 像素X到经度
 */
function pixelToLng(pixelX, zoom)
{
  zoom = zoom ? zoom : 18;
  return pixelX * 360 / (256 << zoom) - 180;

}
// <summary>
/// 根据圆形中心点经纬度和半径取圆形范围(左下、右上经纬度）
/// </summary>
/// <param name="point"></param>
/// <param name="Radius"></param>
/// <param name="zoom"></param>
/// <returns></returns>
function GetCircleRangeByRadius( point, Radius, zoom)
{
  var pixVal = 0;
  zoom = zoom ? zoom : 18;
  switch (zoom)
  {
    case 1:
      pixVal = 78271.517;
      break;
    case 2:
      pixVal = 39135.7585;
      break;
    case 3:
      pixVal = 19567.8792;
      break;
    case 4:
      pixVal = 9783.9396;
      break;
    case 5:
      pixVal = 4891.9698;
      break;
    case 6:
      pixVal = 2445.9849;
      break;
    case 7:
      pixVal = 1222.9925;
      break;
    case 8:
      pixVal = 611.4962;
      break;
    case 9:
      pixVal = 305.7481;
      break;
    case 10:
      pixVal = 152.8741;
      break;
    case 11:
      pixVal = 76.4370;
      break;
    case 12:
      pixVal = 38.2185;
      break;
    case 13:
      pixVal = 19.1093;
      break;
    case 14:
      pixVal = 9.5546;
      break;
    case 15:
      pixVal = 4.7773;
      break;
    case 16:
      pixVal = 2.3887;
      break;
    case 17:
      pixVal = 1.1943;
      break;
    case 18:
      pixVal = 0.5972;
      break;
    case 19:
      pixVal = 0.2986;
      break;
    case 20:
      pixVal = 0.1493;
      break;
    case 21:
      pixVal = 0.0746;
      break;
    case 22:
      pixVal = 0.0373;
      break;
    case 23:
      pixVal = 0.0187;
      break;
  }
  pixVal = Radius / pixVal;
  var lng = lngToPixel(point.Lng, zoom);
  var lat = latToPixel(point.Lat, zoom);
  return {minLng:(Math.floor(pixelToLng(lng - pixVal) * 1000000) / 1000000.0), minLat:(Math.floor(pixelToLat(lat + pixVal) * 1000000) / 1000000.0),
  maxLng:(Math.floor(pixelToLng(lng + pixVal) * 1000000) / 1000000.0), maxLat:(Math.floor(pixelToLat(lat - pixVal) * 1000000) / 1000000.0)};
}


function savePushObj(type, title, content) {
	var obj = {
		type: type,
		title: title,
		content: content,
		createDate: new Date()
	};
	var dbListName = "";
	var dbCountName = "";
	switch (type) {
		case 1:
			var dbListName = 'sysObjList';
			var dbCountName = 'sysMsgCount';
			break;
		case 2:
			var dbListName = 'activityNoticeList';
			var dbCountName = 'activityNoticeCount';
			break;
		case 3:
			var dbListName = 'sysNoticeList';
			var dbCountName = 'sysNoticeCount';
			break;
	}
	db.get(dbListName, function(ret) {
		if (ret != null)
			ret.push(obj);
		else
			ret = [obj];
		db.add(dbListName, ret);
	});
}

/*// 图片毛玻璃渲染
function renderImage(src, canvasId, radius){
    // 创建一个 Image 对象
    var image = new Image();
    // 绑定 load 事件处理器，加载完成后执行
    image.onload = function(){
        // 获取 canvas DOM 对象
        var canvas = document.getElementById(canvasId);
        // 如果高度超标
        //if(image.height > MAX_HEIGHT) {
            // 宽度等比例缩放 *=
            image.width = canvas.width/2;
            image.height = canvas.height/2;
        //}
        // 获取 canvas的 2d 环境对象,
        // 可以理解Context是管理员，canvas是房子
        var ctx = canvas.getContext("2d");
        // canvas清屏
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 重置canvas宽高
        canvas.width = image.width;
        canvas.height = image.height;
        // 将图像绘制到canvas上
        ctx.drawImage(image, 0, 0, image.width, image.height);

        console.log('stackBlurImage2');
		stackBlurCanvasRGB( canvas, 0, 0, image.width, image.height, radius );
		console.log('stackBlurImage3');

        // !!! 注意，image 没有加入到 dom之中
    };
    // 设置src属性，浏览器会自动加载。
    // 记住必须先绑定事件，才能设置src属性，否则会出同步问题。
    image.src = src;
};
jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};*/