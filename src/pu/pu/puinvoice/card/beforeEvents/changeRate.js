/*
 * @Author: jiangfw 
 * @PageInfo: 换算率编辑前
 * @Date: 2018-06-12 21:02:31 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-29 08:43:33
 */
import { FIELD, URL } from '../../constance';
import { ajax } from 'nc-lightapp-front';

export default function isFixedChangeRate(record) {
	return new Promise(function(resolve) {
		let pk_material = record.values.pk_material.value;
		let castunitid = record.values.castunitid.value;
		let data = {
			key: FIELD.vchangerate,
			params: {
				pk_material: pk_material,
				castunitid: castunitid
			}
		};
		ajax({
			url: URL.beforeEditBody,
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
