/*
 * @Author: CongKe
 * @PageInfo: 平台筛选功能
 * @Date: 2018-07-22 09:40:38
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-02-20 19:02:09
 */

function saveFilterCustomColData(props, tableId, attrcode, record, value) {
	let rowId = record.rowid;
	props.editTable.saveFilterCustomColData(tableId, {
		attrcode: attrcode,
		rowId,
		value: value,
	});
}

export { saveFilterCustomColData };
