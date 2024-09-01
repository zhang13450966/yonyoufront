/*
 * @Author: chaiwx 
 * @PageInfo: 编辑后事件-表体  
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-14 14:43:30
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, PAGECODE, FIELDS } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createBodyAfterEventData,
	processBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

export default function(props, moduleId, key, value, rows, i, record) {
	let editItems = [
		FIELDS.cmaterialvid,
		FIELDS.csendstockorgvid,
		FIELDS.creceiveaddrid,
		FIELDS.creceivecustid,
		FIELDS.norigprice,
		FIELDS.nastnum,
		FIELDS.nnum,
		FIELDS.vchangerate,
		FIELDS.nmaterialorigmny,
		FIELDS.creceiveorgvid,
		FIELDS.creceivedeptvid,
		FIELDS.creceivecustid,
		FIELDS.norigmny,
		FIELDS.cfeecustomerid,
		FIELDS.cassumedeptid,
		FIELDS.cassumedeptvid,
		FIELDS.cunitid,
		FIELDS.castunitid
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

		if (key === FIELDS.cassumedeptvid || key === FIELDS.cassumedeptid) {
			if (!value || value.value == '') {
				return;
			}
		} else if (key === FIELDS.cfeecustomerid) {
			if (!value || value.value == '') {
				return;
			}
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
				if (res.data.userObject) {
					if (res.data.userObject.HINTNOPRICE) {
						showWarningInfo(
							getLangByResId(this, '4004Taxinvoice-000002'),
							res.data.userObject.HINTNOPRICE
						); /* 国际化处理： 询价提示*/
					}
				}
			}
		}
	});
}
