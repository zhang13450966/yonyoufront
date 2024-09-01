/*
 * @Author: zhangchangqing 
 * @PageInfo:   表体编辑前事件 换算率编辑前事件，这类方法必须有返回值，返回true为可编辑，false为不可编辑
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-02-16 14:13:58
 */

import { ajax, base, toast } from 'nc-lightapp-front';
import { STOREREQ_CARD, ATTRCODE } from '../../../siconst';
let formId = STOREREQ_CARD.formId;
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
			url: STOREREQ_CARD.bodyBeforeEventURL,
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
