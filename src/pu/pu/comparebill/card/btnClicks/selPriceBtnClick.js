/*
 * @Author: chaiwx 
 * @PageInfo: 优质优价取价
 * @Date: 2018-06-13 21:16:59 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-05-08 14:12:27
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, REQUESTURL } from '../../constance';

export default function(props) {
	let bill = props.createMasterChildDataSimple(PAGECODE.cardPagecode, AREA.cardFormId, AREA.cardTableId);

	let checkedRows = props.cardTable.getCheckedRows(AREA.cardTableId);
	if (checkedRows.length == 0) {
		return;
	}

	// 重置表体
	bill.body[AREA.cardTableId].rows = getRows(checkedRows);

	ajax({
		url: REQUESTURL.getPrice,
		data: bill,
		pageid: PAGECODE.cardPagecode,

		success: (res) => {
			if (res.success && res.data && res.data.body) {
				props.cardTable.updateDataByRowId(AREA.cardTableId, res.data.body[AREA.cardTableId], true, false);
			}
		}
	});
}

function getRows(checkedRows) {
	let rows = [];
	checkedRows.forEach((row) => {
		rows.push(row.data);
	});
	return rows;
}
