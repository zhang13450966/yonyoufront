/*
 * @Author: zhangchqf 
 * @PageInfo: 页面功能描述 物料范围和期间浏览态查询物料指标设定方式使用
 * @Date: 2020-03-24 09:38:40 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2020-12-30 16:36:03
 */

import { ajax, toast } from 'nc-lightapp-front';
import { TARGETADJ_CARD, ATTRCODE } from '../../siconst';
let formId = TARGETADJ_CARD.headf;
export default function beforeEvent(props, moduleId, key, value, data) {
	return new Promise(function(resolve, reject) {
		let ctargetid = props.form.getFormItemsValue(formId, ATTRCODE.ctargetid);
		if (!ctargetid || !ctargetid.value) {
			resolve(6);
		} else {
			let data = {
				key: key,
				params: {
					ctargetid: ctargetid.value
				}
			};
			ajax({
				url: TARGETADJ_CARD.headBeforeEventURL,
				data: data,
				success: (res) => {
					if (res.data) {
						let fmarsetflag = res.data.fmarsetflag;
						if (fmarsetflag) {
							resolve(fmarsetflag);
						} else if (res.data.message) {
							toast({
								color: 'warning',
								content: res.data.message
							});
						}
						resolve(6);
					}
				},
				error: (error) => {
					toast({
						color: 'warning',
						content: error.message
					});
					resolve(6);
				}
			});
		}
	});
}
