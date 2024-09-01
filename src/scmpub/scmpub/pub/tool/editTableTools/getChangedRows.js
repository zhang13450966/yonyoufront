/*
 * @Author: wangceb 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-07-24 17:14:42 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2021-03-12 10:45:53
 */

function getChangedRows(props, moduleId, flag) {
	let changerows = props.editTable.getChangedRows(moduleId, flag == true ? true : false);
	let allrows = props.editTable.getAllRows(moduleId);
	if (allrows.length == 0 || changerows.length == 0) {
		return;
	}

	let indexMap = {};
	let index = 0;
	allrows.forEach((element) => {
		indexMap[element.rowid] = index;
		index++;
	});

	changerows.forEach((item) => {
		item.values.pseudocolumn = { value: indexMap[item.rowid].toString() };
	});
	return changerows;
}

function updateEditTableRows(props, moduleId, rows) {
	let updateRows = [];
	let delRows = [];
	rows.forEach((element) => {
		let pseudocolumn = element.values.pseudocolumn;
		if (pseudocolumn == null || JSON.stringify(pseudocolumn) == '{}') {
			return;
		}
		let updaterow = {
			index: Number(pseudocolumn.value),
			data: element
		};
		updateRows.push(updaterow);
		if (element.status == '3') {
			delRows.push(element.rowid);
		}
	});
	if (delRows.length > 0) {
		props.editTable.deleteTableRowsByRowId(moduleId, delRows, true);
	}
	if (updateRows.length == 0) {
		return;
	}
	props.editTable.updateDataByIndexs(moduleId, updateRows, true, true);
}

function updateDataById(props, tableId, pk_field, sucessrows) {
	if (sucessrows == null || sucessrows.length == 0) {
		return;
	}
	// 组装更新数据
	// let updateDatas = [];
	// 更新成功的数据
	//1. 构建界面选择的信息 主键和index的对应关系
	let selMap = {};
	let selrows = props.editTable.getCheckedRows(tableId);
	selrows.forEach((row) => {
		let selpk = row.data.values[pk_field].value;
		// selMap[selpk] = row.index;
		selMap[selpk] = row.data.rowid;
	});
	sucessrows[tableId].rows.forEach((sucessrow, index) => {
		let pkvalue = sucessrow.rowid;
		// let updateData = {
		// 	// index: selMap[pkvalue],
		// 	data: {
		// 		rowid: selMap[pkvalue],
		// 		values: sucessrow.values
		// 	}
		// };
		sucessrow.rowid = selMap[pkvalue];
		// updateDatas.push(updateData);
	});
	// props.editTable.updateDataByIndexs(tableId, updateDatas);

	props.editTable.updateDataByRowId(tableId, sucessrows[tableId]);
}

/**
 * 浏览态更新行数据（用于单表editTable场景，保存完成后，设置editTabel的行数据和行状态） add by yinliangc 20210310
 * 用props.editTable.updateDataByRowId()，和props.editTable.updateDataByIndexs()，更新行数据，会将行状态设置为1（修改状态），浏览态的数据，行状态都应该是0
 * @param {*} props 
 * @param {*} params tableId-表格ID
 * 					 data-需要更新的数据，保存完成后res.data.tableId即可（rows的上一级）
 * 					 upRowData-是否更新行数据（true为更新，false不更新，默认更新）
 * 					 upRowStatus-是否更新行状态（true为更新，false不更新，默认更新）
 * 					 upCache-是否更新缓存（true为更新，false不更新，默认更新）
 */
function breaseUpdateTableDatas(
	props,
	params = { tableId: '', data: '', upRowData: true, upRowStatus: true, upCache: true }
) {
	let { tableId = '', data = '', upRowData = true, upRowStatus = true, upCache = true } = params;
	if (upRowData) {
		// 设置行数据，false和true表示是否更新表格
		props.editTable.updateRows(tableId, data, false);
	}
	if (upRowStatus) {
		// 设置行状态，false和true表示是否更新表格
		props.editTable.updateRowsProps(tableId, data, { status: '0' }, false);
	}
	if (upCache) {
		// 设置缓存，false和true表示是否更新表格
		props.editTable.resetTableCaches(tableId, true);
	}
}
export { getChangedRows, updateEditTableRows, updateDataById, breaseUpdateTableDatas };
