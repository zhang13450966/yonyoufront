/*
 * @Author: 刘奇 
 * @PageInfo: 卡片下输出按钮事件
 * @Date: 2019-03-18 16:18:08 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-12 14:57:36
 */

import { output, ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';

export default function buttonClick(props) {
	let billids = [];
	let carsubid = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value;
	billids.push(carsubid);
	ajax({
		url: ARSUB_CONST.printdatapermission,
		data: billids,
		success: (res) => {
			if (res.success) {
				output({
					url: ARSUB_CONST.printUrl,
					data: { oids: billids, outputType: ARSUB_CONST.output }
				});
			}
		}
	});
}
