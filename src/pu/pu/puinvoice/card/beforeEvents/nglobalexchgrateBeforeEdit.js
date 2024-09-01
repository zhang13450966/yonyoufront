/*
 * @Author: jiangfw 
 * @PageInfo: 全局本位币汇率编辑前
 * @Date: 2018-06-12 21:02:31 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-09-30 17:01:01
 */
import { FIELD, URL } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';

export default async function nglobalexchgrateBeforeEdit(corigcurrencyid, ccurrencyid) {
	return new Promise(function(resolve) {
		let data = {
			key: FIELD.nglobalexchgrate,
			params: {
				corigcurrencyid: corigcurrencyid, //原币
				ccurrencyid: ccurrencyid //本币币种
			}
		};
		ajax({
			url: URL.beforeEditHead,
			data: data,
			success: (res) => {
				if (res.data) {
					let isedit = res.data.isedit;
					if (isedit) {
						resolve(isedit);
					} else if (res.data.message) {
						toast({
							color: 'warning',
							content: res.data.message
						});
					}
					resolve(false);
				}
			},
			error: (error) => {
				toast({
					color: 'warning',
					content: error.message
				});
				resolve(false);
			}
		});
	});
}
