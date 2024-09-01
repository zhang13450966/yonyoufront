/*
 * @Author: 王勇 
 * @PageInfo: 卡片-运输路线-增行 
 * @Date: 2020-01-17 09:38:03 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:12:10
 */

import { CARDTEMPLATEINFO, ROUTEVOINFO, CARDBUTTONINFO } from '../../const/index';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';

export default function innerAddLineClick(props, index) {
	const len = props.cardTable.getNumberOfRows(CARDTEMPLATEINFO.bodyAreaCode);
	props.cardTable.addRow(CARDTEMPLATEINFO.bodyAreaCode, len, setRowDefaultValue(len), true, () => {
		RownoUtils.setRowNo(props, CARDTEMPLATEINFO.bodyAreaCode);
	});
	if (len == 0) {
		props.cardTable.setEditableByIndex(
			CARDTEMPLATEINFO.bodyAreaCode,
			len,
			[ ROUTEVOINFO.space, ROUTEVOINFO.nmileage ],
			false
		);
		props.button.setDisabled({
			[CARDBUTTONINFO.delLineBtnCode]: false
		});
	}
	// buttonController.call(this, props,VIEWINFO.EDIT_STATUS);
}

function setRowDefaultValue(len) {
	let rowdata = {};
	if (len != 0) {
		rowdata = {
			[ROUTEVOINFO.space]: {
				display: 1,
				value: 1
			}
		};
	} else {
		rowdata = {
			[ROUTEVOINFO.space]: {
				display: len,
				value: len
			},
			[ROUTEVOINFO.nmileage]: {
				display: len,
				value: len
			}
		};
	}
	return rowdata;
}
