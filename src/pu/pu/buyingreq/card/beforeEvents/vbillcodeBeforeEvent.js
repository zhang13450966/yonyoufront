/*
 * @Author: zhangchangqing 
 * @PageInfo:   表头编辑前事件 单据号编辑前事件，这类方法必须有返回值，返回true为可编辑，false为不可编辑
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-08-01 09:40:33
 */

import { ajax, base, toast } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, ATTRCODE } from '../../siconst';
let formId = BUYINGREQ_CARD.formId;
export default function beforeEvent(props, moduleId, key, value, data) {
	return new Promise(function(resolve, reject) {
		
		let pk_org = props.form.getFormItemsValue(formId, ATTRCODE.pk_org);
		if (!pk_org || !pk_org.value) {
			resolve(false);
		} else {
			let data = {
				key: key,
				params: {
					pk_org: pk_org.value,
					billtype: BUYINGREQ_CARD.billType
				}
			};
			ajax({
				url: BUYINGREQ_CARD.headBeforeEventURL,
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
		}
	});
}
