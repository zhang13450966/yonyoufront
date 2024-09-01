/*
 * @Author: 刘奇 
 * @PageInfo: 卡片表体新增行
 * @Date: 2019-03-18 16:35:33 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:10:20
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem } from '../../const';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import buttonController from '../viewController/buttonController';

export default function buttonClick(props, autoFocus) {
	if (autoFocus == false) {
		props.cardTable.addRow(PREPAIDINVOICE_CONST.tableId, undefined, setRowDefaultValue(props), autoFocus);
	} else {
		props.cardTable.addRow(PREPAIDINVOICE_CONST.tableId, undefined, setRowDefaultValue(props));
	}
	RownoUtils.setRowNo(props, PREPAIDINVOICE_CONST.tableId);
	buttonController.call(this, props);
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
		rowdata[PrepaidinvoiceHeadItem.hid] = hid;
	}
	return rowdata;
}

function getHeadValue(props, key) {
	return props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, key);
}
