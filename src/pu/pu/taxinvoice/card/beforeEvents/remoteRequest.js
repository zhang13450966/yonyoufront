/*
 * @Author: chaiwx 
 * @PageInfo: 编辑前同步ajax请求
 * @Date: 2018-06-14 15:24:52 
 * @Last Modified by: liujia9
 * @Last Modified time: 2018-10-24 14:55:33
 */
import { ajax } from 'nc-lightapp-front';
import { showErrorInfo } from 'src/scmpub/scmpub/pub/tool/messageUtil.js';

export default function(url, data) {
	return new Promise(function(resolve, reject) {
		ajax({
			url: url,
			data: data,
			success: (res) => {
				if (res.data) {
					let editFlag = res.data.isedit;
					if (editFlag) {
						resolve(editFlag);
					} else if (res.data.message) {
						showErrorInfo(null, res.data.message);
					}
					resolve(false);
				}
			},
			error: (error) => {
				showErrorInfo(null, error.message);
				resolve(false);
			}
		});
	});
}
