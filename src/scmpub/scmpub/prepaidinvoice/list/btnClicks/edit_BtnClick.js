/*
 * @Author: 王龙华 
 * @PageInfo: 信用额度审批单列表下修改
 * @Date: 2018-06-05 13:59:51 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:19:16
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, BUTTON } from '../../const';

export default function edit_BtnClick(props, record, index) {
	let data = {
		pks: [ record[PrepaidinvoiceHeadItem.hid].value + ',' + record.ts.value ]
	};
	ajax({
		url: PREPAIDINVOICE_CONST.editUrl,
		data: data,
		success: (res) => {
			if (res.success) {
				props.pushTo(PREPAIDINVOICE_CONST.Card_URL, {
					status: PREPAIDINVOICE_CONST.edit,
					id: record[PrepaidinvoiceHeadItem.hid].value,
					buttonType: BUTTON.edit,
					pagecode: PREPAIDINVOICE_CONST.cardPageId
				});
			}
		}
	});
}
