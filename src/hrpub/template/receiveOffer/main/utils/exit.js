 // import toast from '../api/toast';
export default function handelExitPage(headers, flag) {
	if (headers) {
		if (headers.contentpath && headers.redirect === 'REDIRECT') {
			//SpecialTip(headers.redirectstatus, exitPage, headers.contentpath);
			if(typeof window.top.SpecialTip === 'function'){
				window.top.SpecialTip(headers.redirectstatus, exitPage, headers.contentpath);
			}
			return false;
		} else if (headers.authorize === 'FALSE') {
			// toast({ 
			// 	color: 'danger', 
			// 	content: headers.authorizemsg ? decodeURIComponent(headers.authorizemsg) : '该请求未配置鉴权信息' 
			// });
			return false;
		} else {
			return flag;
		}
	}
	/**
         * 退出页面 
         * */
	function exitPage(hrefString) {
		window.top.location.href = hrefString;
	}

}
