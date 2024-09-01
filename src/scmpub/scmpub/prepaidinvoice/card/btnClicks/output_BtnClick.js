/*
 * @Author: 刘奇 
 * @PageInfo: 卡片下输出按钮事件
 * @Date: 2019-03-18 16:18:08 
 * @Last Modified by: 刘奇 
 * @Last Modified time: 2019-03-18 16:18:08 
 */

import { output, ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';

export default function buttonClick(props) {
	let billids = [];
	let hid = props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid).value;
	billids.push(hid);
	ajax({
		url: PREPAIDINVOICE_CONST.printdatapermission,
		data: billids,
		success: (res) => {
			if (res.success) {
				output({
					url: PREPAIDINVOICE_CONST.printUrl,
					data: { oids: billids, outputType: PREPAIDINVOICE_CONST.output }
				});
			}
		}
	});
}
