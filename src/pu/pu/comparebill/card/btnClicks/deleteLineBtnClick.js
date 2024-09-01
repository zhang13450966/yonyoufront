/*
 * @Author: qishy 
 * @PageInfo: 表体删行
 * @Date: 2019-05-07 15:58:54 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-31 10:16:44
 */

import { AREA, BUTTONID } from '../../constance';

export default function(props, record, index) {
	if (index >= 0 && record) {
		// 操作列
		props.cardTable.delRowsByIndex(AREA.cardTableId, index);
		if (props.cardTable.getNumberOfRows(AREA.cardTableId) > 0) {
			let checkArr = props.cardTable.getCheckedRows(AREA.cardTableId);
			if (!checkArr || checkArr.length < 1) {
				props.button.setDisabled({
					[BUTTONID.DeleteLine]: true,
					[BUTTONID.SelPrice]: true
				});
			} else {
				props.button.setDisabled({
					[BUTTONID.DeleteLine]: false,
					[BUTTONID.SelPrice]: false
				});
			}
		}
	} else {
		let checkArr = props.cardTable.getCheckedRows(AREA.cardTableId);
		let rowIndexes = [];
		if (checkArr && checkArr.length > 0) {
			checkArr.forEach((row) => {
				rowIndexes.push(row.index);
			});
			props.cardTable.delRowsByIndex(AREA.cardTableId, rowIndexes);
			// 按钮可用性
			props.button.setDisabled({
				[BUTTONID.DeleteLine]: true,
				[BUTTONID.SelPrice]: true
			});
		}
	}
}
