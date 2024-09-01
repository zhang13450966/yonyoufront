import { AREA, PAGECODE, URL, UISTATE, BUTTONSTATE } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { showWarningInfo, showDeleteDialog, showSuccessInfo } from 'src/scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonCntrol } from '../init/btnEnable';
/*
 * @Author: guozhq 
 * @Pageinfo: 批量删除操作
 * @Date: 2018-03-29 09:14:37 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2019-02-21 15:08:10
 */
export default function(props, text, record, index) {
	let selectedRows = props.editTable.getCheckedRows(AREA.tableArea);
	let rows = [];
	for (let row of selectedRows) {
		rows.push(row.index);
	}
	if (record) {
		rowDelete.call(this, props, text, record, index);
		if (selectedRows) {
			if (rows.length == 1 && rows.includes(index)) {
				buttonCntrol.call(this, BUTTONSTATE.DELETE_SUCCESS, true);
			}
		}
	} else {
		allDelete.call(this, props);
	}
}

/**
 * 行操作删除
 * @param {*} props 
 * @param {*} text 
 * @param {*} record 
 * @param {*} index 
 */
function rowDelete(props, text, record, index) {
	let status = props.editTable.getStatus(AREA.tableArea);
	if (status == UISTATE.edit) {
		props.editTable.delRow(AREA.tableArea, index);
	} else {
		let data = [
			{
				index: index,
				data: record
			}
		];
		realDelete.call(this, props, data);
	}
}
/**
 * 批量删除
 * @param {*} props 
 */
function allDelete(props) {
	// 获取当前表格状态
	let selectedRows = props.editTable.getCheckedRows(AREA.tableArea);
	let status = props.editTable.getStatus(AREA.tableArea);
	if (selectedRows.length == 0) {
		return;
	}
	// 浏览态 编辑态删除按钮有差异
	if (UISTATE.browse === status) {
		showDeleteDialog({
			beSureBtnClick: realDelete.bind(this, props, selectedRows)
		});
	} else {
		let indexArray = selectedRows.map((row) => {
			return row.index;
		});
		props.editTable.deleteTableRowsByIndex(AREA.tableArea, indexArray);
		buttonCntrol.call(this, BUTTONSTATE.DELETE_SUCCESS, true);
	}
}

/**
 * 真正的删除数据库操作
 * @param {*} props 
 * @param {*} selectedRows 
 */
function realDelete(props, selectedRows) {
	let selectData = selectedRows.map((row) => {
		return row.data;
	});
	const data = {
		pageid: PAGECODE,
		model: {
			areaType: 'table',
			pageinfo: null,
			rows: selectData
		}
	};
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					showWarningInfo(null, getLangByResId(this, '2014BEGINVARIANCE-000001')); /* 国际化处理： 提示,已经期初记账不允许删除*/
					return;
				}
				let indexs = selectedRows.map((item) => {
					return item.index;
				});
				//这个地方删除有问题 需要使用新的API
				props.editTable.deleteTableRowsByIndex(AREA.tableArea, indexs);
				let tableData = props.editTable.getAllRows(AREA.tableArea);
				let result = tableData.filter((item) => {
					return item.status != 3;
				});
				let newData = {
					rows: result
				};
				props.editTable.setTableData(AREA.tableArea, newData);
				showSuccessInfo(getLangByResId(this, '2014BEGINVARIANCE-000013')); /* 国际化处理： 删除成功*/
			}
		}
	});
}
