/*
 * @Author: lichao 
 * @PageInfo: 获取地址栏里的参数值  
 * @Date: 2019-02-26 10:07:37 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-02-26 10:13:48
 */
export default function getUrlParam(pop) {
	if (!pop) return;
	let result;
	let queryString = window.location.search || window.location.hash;
	if (queryString.includes('?')) {
		queryString = queryString.split('?')[1];
	} else {
		queryString = queryString.substring(1);
	}
	if (queryString) {
		let paramsArr = queryString.split('&');
		if (paramsArr && paramsArr instanceof Array) {
			paramsArr.forEach((item) => {
				if (item.indexOf('=') != -1 && item.split('=') && item.split('=') instanceof Array) {
					if (item.split('=')[0] === pop) {
						if (item.split('=')[1]) {
							result = decodeURIComponent(item.split('=')[1]);
						}
					}
				}
			});
		}
	}
	return result;
}
