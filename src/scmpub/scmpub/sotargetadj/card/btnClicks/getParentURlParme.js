/*
 * @Author: zhangchangqing 
 * @PageInfo: 获取父页面参数的方法
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-06-26 13:24:36
 */
export default function getUrlParam(parm) {
	//获取父地址中的参数
		let appUrl = decodeURIComponent(window.parent.location.href).split('?');
		if (appUrl && appUrl[1]){
		    let appPrams = appUrl[1].split('&');
		    if(appPrams && appPrams instanceof Array){
				let parmObj={};
				appPrams.forEach(item=>{
					let key = item.split('=')[0];
					let value = item.split('=')[1];
					parmObj[key] = value;
				})
				return parmObj[parm];
		    }
		}
}
