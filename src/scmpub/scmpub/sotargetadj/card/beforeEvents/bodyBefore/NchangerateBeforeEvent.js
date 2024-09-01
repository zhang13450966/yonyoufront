/*
 * @Author: zhangchangqing 
 * @PageInfo:   表头编辑前事件 单据号编辑前事件，这类方法必须有返回值，返回true为可编辑，false为不可编辑
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:14:42
 */

import { ajax, toast } from 'nc-lightapp-front';
import { TARGETADJ_CARD } from '../../../siconst';
export default function beforeEvent(props, moduleId, key, matetil, castunitid) {
	return new Promise(function(resolve, reject) {
		let data = {
			key: key,
			params: {
				pk_material: matetil,
				castunitid: castunitid
			}
		};
		ajax({
			url: TARGETADJ_CARD.bodyBeforeEventURL,
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
