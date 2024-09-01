import axios from 'axios';
// import Loading from './nc_Loading';
import ReactDOM from 'react-dom';
// import toast from './toast';
import Gzip from './gzip';
import getBusinessInfo from './getBusinessInfo';
import { getParamByLocation } from './getParamByLocation';
import ViewModel from './viewmodel/viewmodel';
import handelExitPage from './exit.js';
import Cipher, {opaqueDecrypt} from './cipher';

let { setCookie , setGlobalStore, getGlobalStore, getCookie} = ViewModel;

const DEFAULT_DELAY_TIME = 1000;

//把请求成功的业务数据放在ViewModel的getRenderPageData上，执行获取业务数据之后的二开js
function dealSecDevData(res, IsGetPageData) {
	if (IsGetPageData === true) {
		ViewModel.getRenderPageData = Object.assign({}, res);
		ViewModel.dataAlreadyLoaded && ViewModel.dataAlreadyLoaded(res);
	}
}

// 添加一个加签处理方法 -- by bbqin
function addDataSign(data, userCode, allin = false) {
	// console.log(data, userCode);
    if (
        typeof transSn === "undefined" ||
        typeof transSign === "undefined" ||
        !userCode
    ) {
        return data;
    }
    // 先加签全部数据 或者部分数据
    let dataStr =  JSON.stringify(data);
    // 这里会影响原字符串 （编码、位数？）导致后台解析不了字符串
    let strDataSign = (allin ? dataStr : data.busiParamJson) + "";
    // 加签 -- bbqin
    data.sysParamJson.sn = transSn(userCode);
	data.sysParamJson.signdata = transSign(strDataSign, userCode);
    return data;
}


// 此时的cookie是当前界面唯一 如果放到ajax内部  
// 多个请求的情况下 会导致前面的cookie被覆盖  所有请求用的是第二次的cookie  而加密用的cookie是第一次的
let cckk = getCookie('cookiets') || Date.now(); //双cookie验证 liuxis
// 做一次 数据转型
cckk = isNaN(cckk) ? cckk : Number(cckk);

export default function Ajax({
	url = '/',
	method = 'post',
	data = {},
	async = true,//默认异步，同步false
	loading = true,
	print = false, // 针对打印接口
	windowContainer = window,
	loadingContainer,
	toastContainer,
	success = function(res) {
		console.log(res);
	},
	error = function(res, url) {
		console.error(res);
		let msgContent = JSON.stringify(res.message);
		// toast({ color: 'danger', content: msgContent, container: toastContainer, mark: msgContent + url });
	},
	mode = '',
	params = {},
	from = '',
	headers = { 'Content-Type': 'application/json;charset=UTF-8' },
	delayTime,
	IsGetPageData = false,//业务组请求首次渲染页面的数据
}) {
	let stack = [];
	let div;
	// modify by wangyang
	div = windowContainer.document.createElement('div');
	windowContainer.document.body.appendChild(div);
	div.className = 'nc-loading-hidden';

	//console.error(url,"ajax请求开始");
	typeof window.top.startAjax === 'function' && window.top.startAjax(url);
	
	let gziptools = new Gzip();
	// 解决 接口报错  清理本地的cookie的情况 报错 by bbqin
	//双cookie验证 --liuxis
	// let cookiets = gziptools.zip(JSON.stringify(cckk));
	setCookie('cookiets', cckk);


	//window.actionName
	var app = '',
		appcode = '';
	let appN = window.parent.location.hash.split('?');
	if (appN && appN[1]) {
		let appPrams = appN[1].split('&');
		if (appPrams && appPrams instanceof Array) {
			appPrams.forEach((item) => {
				if (item.indexOf('=') != -1 && item.split('=') && item.split('=') instanceof Array) {
					if (item.split('=')[0] === 'n') {
						if (item.split('=')[1]) {
							app = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
						}
					}
					if (item.split('=')[0] === 'c') {
						if (item.split('=')[1]) {
							appcode = decodeURIComponent(decodeURIComponent(item.split('=')[1]));
						}
					}
				}
			});
		}
	}
	if (!appcode) {
		if (window.parent && window.parent.parent) {
			//嵌套两层iframe
			appcode = getParamByLocation(window.parent.location.hash, 'c');
		}
	}

	let busiaction = `${app || null}-${window.actionName || null}`;
	// 此处 yanggqm修改 formData上传。
	let sysParamJson = {
			busiaction,
			appcode: appcode,
			ts: new Date().getTime(),
			from: from ,
			pagecs: cckk 
		},
		newData;

	// 用户信息获取 --bbqin
	let userInfos = getBusinessInfo();
	let userCode = userInfos && userInfos.userCode ? userInfos.userCode : null;
	
	if (headers['Content-Type'] == 'multipart/form-data') {
		newData = data;
		let sysParamData = {
			sys_busiaction: `${app || null}-${window.actionName || null}`,
			sys_appcode: appcode,
			sys_ts: new Date().getTime()
		};
		for (let key in sysParamData) {
			newData.append(key, sysParamData[key]);
		}
	} else {
		let strData = typeof data === 'string' ? data : JSON.stringify(data);

		newData = {
			busiParamJson: strData,
			sysParamJson
		};
	}
	// 修改结束  如要修改，请打招呼。

	/**
     * 开启报错提示
     */
	let flag = true;
	let gzipFlag = false;
	let gzip = getGlobalStore('gzip');
	
	// 加密 bbqin
	let cipherFlag = localStorage.getItem('rockin');
	let aeskey = '';
	let cckks = cckk + ''; 
	aeskey = opaqueDecrypt(localStorage.getItem('cowboy'));
	aeskey = cckks + aeskey.substring(0, aeskey.length - cckks.length);

	// 将是否加密缓存到组件单例上
	Cipher.CipherFlag = cipherFlag === "true";

	//异步请求
	function asyncAxios(){
		axios({
			method: method,
			params: params,
			headers: headers,
			url: url,
			data: newData,
			withCredentials: true,
			transformRequest: [
			],
			transformResponse: [
				function(data, headers) {
					//处理401
					flag = handelExitPage(headers, flag);
					if (flag) {
						// 先进行 解密处理 bbqin
						data = (typeof data === 'string' && !print) ? Cipher.decrypt(data, aeskey) : data;
						if (gzipFlag) {
							let resData = print ? data : gziptools.unzip(data);
							return resData;
						} else {
							return isJSON(data) ? JSON.parse(data) : data;
						}
					} else {
						return null;
					}
				}
			]
		})
			.then((res) => {
				if (res) {
					typeof window.top.endAjax === 'function' && window.top.endAjax(url);
					if (mode === 'normal') {
						success(res);
						dealSecDevData(res, IsGetPageData)
					} else {
						if (res.data.success || res.success) {
							success(res.data);
							dealSecDevData(res.data, IsGetPageData)
						} else {
							throw new Error(res.data.error.message);
						}
					}
				}
			})
			.catch((res) => {
				if (flag) {
					let data = res;
					data = typeof data === 'string' ? Cipher.decrypt(data, aeskey) : data;
					if (print) { // 这里就是为了捕捉 print情况下压缩了
						data = gziptools.unzip(data);
					}
					error(data, url);
				}
			});
	}

	//同步请求
	function syncAxios(){
		//同步
		let requestData = JSON.stringify(newData);

		if (gzipFlag) {
			requestData = gziptools.zip(JSON.stringify(newData));
		}
		ajax({
			type: method,
			url: url, //添加自己的接口链接
			data: Cipher.encrypt(requestData, aeskey),
			async: async,
			before: function() {
			},
			success: function(str) {

				try {
					typeof window.top.endAjax === 'function' && window.top.endAjax(url);
					let res = null;
					str = typeof str === 'string' ? Cipher.decrypt(str, aeskey) : str;
					if (gzipFlag) {
						res = gziptools.unzip(str);
					} else {
						res = JSON.parse(str);
					}
					if (res.success) {
						success(res);
						dealSecDevData(res, IsGetPageData)
					} else {
						throw new Error(res.error.message);
					}
				} catch (e) {
					error(e, url);
				}
			}
		});
	}

	if (gzip === null) {
		axios({
			method: 'post',
			url: '/nccloud/platform/gzip/switch.do',
			data: {
				sysParamJson: {
					busiaction: '查询请求流量压缩开关',
					pagecs: cckk
				}
			},    
			withCredentials: true
		})
			.then((res) => {
				
				if (res.data) {
					if (res.data.success || res.success) {
						if (res.data.data) {
							setGlobalStore('gzip', 1);
							gzipFlag = true;
						} else {
							setGlobalStore('gzip', 0);
							gzipFlag = false;
						}

						// add by bbqin
						newData = addDataSign(newData, userCode);

						//执行ajax请求
						if (async) {
							//异步
							asyncAxios();
						} else {
							//同步
							syncAxios();
						}
					} else {
						throw new Error(res.data.error);
					}
				}
			})
			.catch((res) => {

				error(res, url);
			});
	} else {
		if (getGlobalStore('gzip') == '1') {
			gzipFlag = true;
		} else if (getGlobalStore('gzip') == '0') {
			gzipFlag = false;
        }
        
		// add by bbqin
		newData = addDataSign(newData, userCode);
        
		//执行ajax请求
		if (async) {
			//异步
			asyncAxios();
		} else {
			//同步
			syncAxios();
		}
	}
}

function ajax(options) {
	//编码数据
	// function setData() {
	// 	//设置对象的遍码
	// 	function setObjData(data, parentName) {
	// 		function encodeData(name, value, parentName) {
	// 			var items = [];
	// 			name = parentName === undefined ? name : parentName + '[' + name + ']';
	// 			if (typeof value === 'object' && value !== null) {
	// 				items = items.concat(setObjData(value, name));
	// 			} else {
	// 				name = encodeURIComponent(name);
	// 				value = encodeURIComponent(value);
	// 				items.push(name + '=' + value);
	// 			}
	// 			return items;
	// 		}

	// 		var arr = [],
	// 			value;
	// 		if (Object.prototype.toString.call(data) == '[object Array]') {
	// 			for (var i = 0, len = data.length; i < len; i++) {
	// 				value = data[i];
	// 				arr = arr.concat(encodeData(typeof value == 'object' ? i : '', value, parentName));
	// 			}
	// 		} else if (Object.prototype.toString.call(data) == '[object Object]') {
	// 			for (var key in data) {
	// 				value = data[key];
	// 				arr = arr.concat(encodeData(key, value, parentName));
	// 			}
	// 		}
	// 		return arr;
	// 	}

	// 	//设置字符串的遍码，字符串的格式为：a=1&b=2;
	// 	function setStrData(data) {
	// 		var arr = data.split('&');
	// 		for (var i = 0, len = arr.length; i < len; i++) {
	// 			let name = encodeURIComponent(arr[i].split('=')[0]);
	// 			let value = encodeURIComponent(arr[i].split('=')[1]);
	// 			arr[i] = name + '=' + value;
	// 		}
	// 		return arr;
	// 	}

	// 	if (data) {
	// 		if (typeof data === 'string') {
	// 			data = setStrData(data);
	// 		} else if (typeof data === 'object') {
	// 			data = setObjData(data);
	// 		}
	// 		data = data.join('&').replace('/%20/g', '+');
	// 		//若是使用get方法或JSONP，则手动添加到URL中
	// 		if (type === 'get' || dataType === 'jsonp') {
	// 			url += url.indexOf('?') > -1 ? (url.indexOf('=') > -1 ? '&' + data : data) : '?' + data;
	// 		}
	// 	}
	// }

	// JSONP
	function createJsonp() {
		var script = document.createElement('script'),
			timeName = new Date().getTime() + Math.round(+('0.'+(+new Date()+'').split('').reverse().join('')) * 1000),
			callback = 'JSONP_' + timeName;

		window[callback] = function(data) {
			clearTimeout(timeout_flag);
			document.body.removeChild(script);
			success(data);
		};
		script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + callback;
		script.type = 'text/javascript';
		document.body.appendChild(script);
		setTime(callback, script);
	}

	//设置请求超时
	function setTime(callback, script) {
		if (timeOut !== undefined) {
			timeout_flag = setTimeout(function() {
				if (dataType === 'jsonp') {
					delete window[callback];
					document.body.removeChild(script);
				} else {
					timeout_bool = true;
					xhr && xhr.abort();
				}
				console.log('timeout');
			}, timeOut);
		}
	}

	// XHR
	function createXHR() {
		//由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
		//所以创建XHR对象，需要在这里做兼容处理。
		function getXHR() {
			if (window.XMLHttpRequest) {
				return new XMLHttpRequest();
			} else {
				//遍历IE中不同版本的ActiveX对象
				var versions = [ 'Microsoft', 'msxm3', 'msxml2', 'msxml1' ];
				for (var i = 0; i < versions.length; i++) {
					try {
						var version = versions[i] + '.XMLHTTP';
						return new ActiveXObject(version);
					} catch (e) {}
				}
			}
		}

		//创建对象。
		xhr = getXHR();
		xhr.open(type, url, async);
		//设置请求头
		if (type === 'post' && !contentType) {
			//若是post提交，则设置content-Type 为application/x-www-four-urlencoded
			xhr.setRequestHeader('Content-Type', 'application/x-www-four-urlencoded;charset=UTF-8');
		} else if (contentType) {
			xhr.setRequestHeader('Content-Type', contentType);
		}
		xhr.withCredentials = true;
		//添加监听
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (timeOut !== undefined) {
					//由于执行abort()方法后，有可能触发onreadystatechange事件，
					//所以设置一个timeout_bool标识，来忽略中止触发的事件。
					if (timeout_bool) {
						return;
					}
					clearTimeout(timeout_flag);
				}
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					success(xhr.responseText);
				} else {
					error(xhr.status, xhr.statusText);
				}
			}
		};
		//发送请求
		xhr.send(type === 'get' ? null : data);
		setTime(); //请求超时
	}

	var url = options.url || '', //请求的链接
		type = (options.type || 'get').toLowerCase(), //请求的方法,默认为get
		data = options.data, //|| JSON.stringify({}), //请求的数据
		contentType = options.contentType || '', //请求头
		dataType = options.dataType || '', //请求的类型
		async = options.async === undefined ? true : options.async, //是否异步，默认为true.
		timeOut = options.timeOut, //超时时间。
		before = options.before || function() {}, //发送之前执行的函数
		error = options.error || function() {}, //错误执行的函数
		success = options.success || function() {}; //请求成功的回调函数
	var timeout_bool = false, //是否请求超时
		timeout_flag = null, //超时标识
		xhr = null; //xhr对角
	//setData();
	before();
	if (dataType === 'jsonp') {
		createJsonp();
	} else {
		createXHR();
	}
}
function isJSON(str) {
	if (typeof str == 'string') {
		try {
			var obj = JSON.parse(str);
			if (typeof obj == 'object' && obj) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			console.log('error：' + str + '!!!' + e);
			return false;
		}
	}
	console.log('It is not a string!');
}
