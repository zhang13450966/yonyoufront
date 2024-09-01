/*
 * @Author: chaiwx 
 * @PageInfo: 编辑后事件-表体  
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-26 15:17:31
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, PAGECODE, FIELDS } from '../../constance';
import {
	createBodyAfterEventData,
	processBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

export default function(props, moduleId, key, value, rows, i, record) {
	let editItems = [
		FIELDS.nqtorigprice,
		FIELDS.nqtorigtaxprice,
		FIELDS.norigtaxmny,
		FIELDS.nqttaxprice,
		FIELDS.nqtprice,
		FIELDS.ntaxrate,
		FIELDS.ftaxtypeflag,
		FIELDS.nnum,
		FIELDS.nastnum,
	];

	if (editItems.includes(key)) {
		// 新旧相同，不触发
		let isContinue = true;
		for (let j = 0; j < rows.length; j++) {
			let newvalue = rows[j].newvalue.value == '' ? null : rows[j].newvalue.value;
			let oldvalue = rows[j].oldvalue.value == '' ? null : rows[j].oldvalue.value;
			if (newvalue == oldvalue) {
				isContinue = false;
			} else {
				isContinue = true;
				break;
			}
		}
		if (!isContinue) {
			return;
		}

		let data = createBodyAfterEventData(
			props,
			PAGECODE.cardPagecode,
			AREA.cardFormId,
			AREA.cardTableId,
			moduleId,
			key,
			rows,
			i
		);
		doAction.call(this, props, data, key, i);
	}
}

function doAction(props, data, key, i) {
	// 去除删除的行
	let rows = data.card.body.body.rows;
	let newRows = [];
	rows.forEach((row) => {
		if (row.status != '3') {
			newRows.push(row);
		}
	});
	data.card.body.body.rows = newRows;

	ajax({
		url: REQUESTURL.bodyAfterEdit,
		data: data,
		async: false,
		success: (res) => {
			if (res.data) {
				processBillCardBodyEditResult(props, AREA.cardTableId, res.data, i);
			}
		}
	});
}
