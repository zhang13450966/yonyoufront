/*
 * @Author: wangceb 
 * @PageInfo: 状态操作
 * @Date: 2018-08-25 18:27:23 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-23 15:44:42
 */
import { ajax } from 'nc-lightapp-front';
import { TRANSPORTSTATUS_CONST } from '../const';
import btn_Controller from './btn_Controller';

export default function statusOperator(props, rows, isClose) {
	// 按状态过滤
	let filterRow = [];
	rows.table.rows.forEach((element) => {
		if (element.values.bsendendflag.value !== isClose) {
			filterRow.push(element);
		}
	});
	if (filterRow.length === 0) {
		return;
	}
	rows.table.rows = filterRow;
	let info = {
		grid: rows,
		isCloseOpr: isClose
	};

	ajax({
		url: '/nccloud/dm/transport/btnoperator.do',
		data: info,
		success: (res) => {
			if (res.success) {
				updateUI.call(this, props, res.data);
				btn_Controller.call(this, props);
			}
		}
	});
}

function updateUI(props, sucessrows) {
	let updateDatas = [];
	let selMap = {};
	let tableRows = props.table.getAllTableData(TRANSPORTSTATUS_CONST.TABLEID);
	// let selrows = props.table.getCheckedRows(tableId);
	tableRows.rows.forEach((row, index) => {
		let selpk;
		if (props.transpk && row.values[props.transpk] && row.values[props.transpk].value) {
			selpk = row.values[props.transpk].value;
		} else {
			selpk = row.values['cbill_bid'].value;
		}
		selMap[selpk] = index;
	});
	sucessrows[TRANSPORTSTATUS_CONST.TABLEID].rows.forEach((sucessrow, index) => {
		// let pkvalue = sucessrow.values[props.transpk || 'cbill_bid'].value;
		let pkvalue;
		if (props.transpk && sucessrow.values[props.transpk] && sucessrow.values[props.transpk].value) {
			pkvalue = sucessrow.values[props.transpk].value;
		} else {
			pkvalue = sucessrow.values['cbill_bid'].value;
		}
		let updateData = {
			index: selMap[pkvalue],
			data: { values: sucessrow.values }
		};
		updateDatas.push(updateData);
	});

	props.table.updateDataByIndexs(TRANSPORTSTATUS_CONST.TABLEID, updateDatas);
}
