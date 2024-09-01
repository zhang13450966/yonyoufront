/*
 * @Author: 王勇 
 * @PageInfo: 卡片-运输路线-增行 
 * @Date: 2020-01-17 09:38:03 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:06:05
 */

import { CARDTEMPLATEINFO, ROUTEVOINFO, CARDBUTTONINFO } from '../../const/index';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';

export default function innerAddLineClick(props) {
	const len = props.cardTable.getNumberOfRows(CARDTEMPLATEINFO.bodyAreaCode);
	props.cardTable.addRow(CARDTEMPLATEINFO.bodyAreaCode, len, setRowDefaultValue(len));
	RownoUtils.setRowNo(props, CARDTEMPLATEINFO.bodyAreaCode);
	if (len == 0) {
		props.cardTable.setEditableByIndex(
			CARDTEMPLATEINFO.bodyAreaCode,
			len,
			[ [ ROUTEVOINFO.space ], [ ROUTEVOINFO.nmileage ] ],
			false
		);
		props.button.setDisabled({
			[CARDBUTTONINFO.delLineBtnCode]: false
		});
	}
}

function setRowDefaultValue(len) {
	let rowdata = {};
	if (len != 0) {
		rowdata = {
			[ROUTEVOINFO.space]: {
				display: null,
				value: 1
			}
		};
	} else {
		rowdata = {
			[ROUTEVOINFO.space]: {
				display: null,
				value: len
			},
			[ROUTEVOINFO.nmileage]: {
				display: null,
				value: len
			}
		};
	}
	return rowdata;
}
