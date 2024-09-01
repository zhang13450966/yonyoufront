/* eslint-disable no-cond-assign */
function getCookie(name) {
	//匹配字段
	var arr,
		reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

	if ((arr = document.cookie.match(reg))) {
		return arr[2];
	} else {
		return null;
	}
}

let a = getLangCode();

// let a = 'zh-CN'
export function getLangCode() {
	// SetCookie('langCode', 'simpchn')
	// return getCookie('langCode') || 'simpchn';
	// return 'english'
    // return 'tradchn'
    return localStorage.getItem('langCode') || 'simpchn';
}

export var localeLang = a;
