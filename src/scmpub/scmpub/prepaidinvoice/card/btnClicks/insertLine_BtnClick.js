/*
 * @Author: 刘奇 
 * @PageInfo: 卡片表体行操作列插入行按钮
 * @Date: 2019-03-18 16:34:47 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:12:04
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem } from '../../const';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';

export default function buttonClick(props, record, index) {
	props.cardTable.addRow(PREPAIDINVOICE_CONST.tableId, index, setRowDefaultValue(props));
	RownoUtils.setRowNo(props, PREPAIDINVOICE_CONST.tableId);
	// let data = props.createBodyAfterEventData(
	// 	PREPAIDINVOICE_CONST.cardPageId,
	// 	PREPAIDINVOICE_CONST.formId,
	// 	PREPAIDINVOICE_CONST.tableId,
	// 	PREPAIDINVOICE_CONST.formId,
	// 	null,
	// 	null
	// );
	// data['index'] = index;
	// ajax({
	// 	url: PREPAIDINVOICE_CONST.bodyrowafter,
	// 	pageid: PREPAIDINVOICE_CONST.cardPageId,
	// 	data: data,
	// 	success: (res) => {
	// 		if (res.data) {
	// 			props.cardTable.updateDataByRowId(
	// 				PREPAIDINVOICE_CONST.tableId,
	// 				res.data.body[PREPAIDINVOICE_CONST.tableId]
	// 			);
	// 			RownoUtils.setRowNo(props, PREPAIDINVOICE_CONST.tableId);
	// 		}
	// 	}
	// });
}
function setRowDefaultValue(props) {
	let pk_org = getHeadValue(props, PrepaidinvoiceHeadItem.pk_org);
	let hid = getHeadValue(props, PrepaidinvoiceHeadItem.hid);
	let dbilldate = getHeadValue(props, PrepaidinvoiceHeadItem.dbilldate);
	let pk_group = getHeadValue(props, PrepaidinvoiceHeadItem.pk_group);

	let rowdata = {
		[PrepaidinvoiceBodyItem.pk_org]: pk_org,
		[PrepaidinvoiceBodyItem.pk_group]: pk_group,
		[PrepaidinvoiceBodyItem.dbilldate]: dbilldate
	};
	if (hid != null && hid.value != undefined) {
		rowdata[PrepaidinvoiceBodyItem.hid] = hid;
	}
	return rowdata;
}

function getHeadValue(props, key) {
	return props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, key);
}
