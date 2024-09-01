/*
 * @Author: jiangfw 
 * @PageInfo: 散户编辑前
 * @Date: 2018-06-12 21:02:31 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-30 10:15:38
 */
import { URL } from '../../constance';
import { ajax } from 'nc-lightapp-front';

export default async function isQCEnable(pk_org) {
	return new Promise(function(resolve) {
		ajax({
			url: URL.qcEnable,
			data: { pk_org },
			success: (res) => {
				if (res.data) {
					resolve(true);
				} else {
					resolve(false);
				}
			}
			// error: (error) => {
			// 	toast({
			// 		color: 'warning',
			// 		content: error.message
			// 	});
			// 	resolve(false);
			// }
		});
	});
}
