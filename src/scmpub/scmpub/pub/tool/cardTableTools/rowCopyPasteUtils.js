import { deepClone } from 'nc-lightapp-front';

/*
 * @Author: chaiwx 
 * @PageInfo: 表体复制粘贴行工具文件
 * @Date: 2018-06-15 15:33:31 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2021-09-29 19:00:38
 */

// 表体肩部按钮初始化状态
const BTNINITSTATUS = true;
// 表体肩部按钮复制中状态
const BTNPASTESTATUS = false;

/**
 * 复制-单行（通常用于操作列复制）
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} record --操作列操作中的行数据
 * @param {*} initBtns --初始化显示的按钮
 * @param {*} pasteBtns --复制中显示的按钮
 */
function copyRow(props, moduleId, record, initBtns, pasteBtns) {
	// 缓存复制的数据
	// this.setState({
	// 	copyRowDatas: record
	// });
	this.copyRowDatas = record;
	// 设置按钮可见性
	setBtnVisible(props, initBtns, pasteBtns, BTNPASTESTATUS);
	// 多选框不可用
	props.cardTable.setAllCheckboxAble(moduleId, false);
	return record;
}

/**
 * 复制-多行（通常用于肩部复制）
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 */
function copyRows(props, moduleId, initBtns, pasteBtns) {
	// 缓存选中行数据
	let checkArr = props.cardTable.getCheckedRows(moduleId);
	if (checkArr && checkArr.length > 0) {
		// this.setState({
		// 	copyRowDatas: checkArr
		// });
		this.copyRowDatas = checkArr;
		setBtnVisible(props, initBtns, pasteBtns, BTNPASTESTATUS);
		props.cardTable.setAllCheckboxAble(moduleId, false);
		return checkArr;
	}
}

/**
 * 粘贴数据到index下方（通常用于操作列粘贴）
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} index 
 * @param {*} initBtns --复制前显示按钮
 * @param {*} pasteBtns --复制后显示按钮
 * @param {*} fieldsForClear --需要清空的字段
 */
function pasteRowsToIndex(props, moduleId, index, initBtns, pasteBtns, fieldsForClear, grandSonFields4Clear) {
	// 粘贴至此
	pasteLines(props, moduleId, this.copyRowDatas, index - 1, fieldsForClear, grandSonFields4Clear);
	// 清空缓存，切换按钮
	// this.setState({
	// 	copyRowDatas: null
	// });
	this.copyRowDatas = null;
	setBtnVisible(props, initBtns, pasteBtns, BTNINITSTATUS);
	props.cardTable.selectAllRows(moduleId, false);
	props.cardTable.setAllCheckboxAble(moduleId, true);
}

/**
 * 粘贴至末行
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 * @param {*} fieldsForClear 
 */
function pasteRowsToTail(props, moduleId, initBtns, pasteBtns, fieldsForClear, grandSonFields4Clear) {
	// 批量粘贴至末行
	let rowCount = props.cardTable.getNumberOfRows(moduleId);
	pasteRowsToIndex.call(this, props, moduleId, rowCount, initBtns, pasteBtns, fieldsForClear, grandSonFields4Clear);
}

/**
 * 取消复制
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 */
function cancel(props, moduleId, initBtns, pasteBtns) {
	// 清空复制行缓存数据
	// this.setState({
	// 	copyRowDatas: null
	// });
	this.copyRowDatas = null;
	setBtnVisible(props, initBtns, pasteBtns, BTNINITSTATUS);
	props.cardTable.selectAllRows(moduleId, false);
	props.cardTable.setAllCheckboxAble(moduleId, true);
}

/**
 * 批量复制方法
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} copyRowDatas 
 * @param {*} index 
 * @param {*} fieldsForClear 
 */
function pasteLines(props, moduleId, copyRowDatas, index, fieldsForClear, grandSonFields4Clear) {
	//deepClone效率存在问题 使用JSON.parse 目测没问题
	//let data = deepClone(copyRowDatas);
	let data = JSON.parse(JSON.stringify(copyRowDatas));
	if (data) {
		let copyRowIds = [];
		if (data instanceof Array) {
			// 多行
			// 选中行行数
			let checkCount = data.length;
			let insertData = [];
			// 循环粘贴至末行
			for (let i = 0; i < checkCount; i++) {
				let rowData = data[i].data;
				copyRowIds.push(rowData.rowid);
				clearFields(rowData, fieldsForClear);
				insertData.push(rowData);
			}
			props.cardTable.insertRowsAfterIndex(moduleId, insertData, index);
		} else {
			// 单行
			clearFields(data, fieldsForClear);
			copyRowIds.push(data.rowid);
			props.cardTable.insertRowsAfterIndex(moduleId, data, index);
		}
		pasteGrandSonsLines(props, moduleId, copyRowIds, index, grandSonFields4Clear);
	}
}

/**
 * 粘贴孙表
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} copyRowIds 
 * @param {*} index 
 * @param {*} grandSonFields4Clear 
 */
function pasteGrandSonsLines(props, moduleId, copyRowIds, index, grandSonFields4Clear) {
	if (!grandSonFields4Clear) {
		return;
	}
	// 孙表复制粘贴逻辑
	let rows = props.cardTable.getAllRows(moduleId);
	// 获取原始行rowid
	let grandSonCopyDataArray = [];
	let sonDatas = props.cardTable.getAllGrandData({ parentId: moduleId });
	copyRowIds.forEach((rowid) => {
		let sonData = sonDatas[rowid];
		sonData = deepClone(sonData);
		let grandSonCopyDataMap = {};
		for (const grandSonArea in sonData) {
			if (sonData.hasOwnProperty(grandSonArea)) {
				const sonRows = sonData[grandSonArea].rows;
				clearFields(sonRows, grandSonFields4Clear);
				grandSonCopyDataMap[grandSonArea] = sonRows;
			}
		}
		grandSonCopyDataArray.push(grandSonCopyDataMap);
	});
	// 获取目标Rowid
	for (let i = 0; i < copyRowIds.length; i++) {
		let rowid = rows[i + index + 1].rowid;
		let grandSonCopyDataMap = grandSonCopyDataArray[i];
		for (const grandSonArea in grandSonCopyDataMap) {
			if (grandSonCopyDataMap.hasOwnProperty(grandSonArea)) {
				const sonRows = grandSonCopyDataMap[grandSonArea];
				sonRows.forEach((row) => {
					row.status = '2';
					row.rowid = null;
				});
				props.cardTable.setGrandTableData({
					rowid: rowid,
					parentId: moduleId,
					tableId: grandSonArea,
					data: { rows: sonRows },
					shouldForceUpdate: false,
					isCache: false,
					isDiffUpdate: false
				});
			}
		}
	}
}

/**
 * 清空要清空的字段
 * @param {*} rowData 
 * @param {*} fieldsForClear 
 */
function clearFields(copyRowDatas, fieldsForClear) {
	if (fieldsForClear && fieldsForClear instanceof Array) {
		if (copyRowDatas instanceof Array) {
			copyRowDatas.forEach((rowData) => {
				fieldsForClear.forEach((field) => {
					rowData.values[field] = {
						value: null,
						display: null,
						scale: -1
					};
				});
			});
		} else {
			fieldsForClear.forEach((field) => {
				copyRowDatas.values[field] = {
					value: null,
					display: null,
					scale: -1
				};
			});
		}
	}
}

/**
 * 设置按钮可见性
 * @param {*} props 
 * @param {*} initBtns 
 * @param {*} pasteBtns 
 * @param {*} status 
 */
function setBtnVisible(props, initBtns, pasteBtns, status) {
	if (initBtns) {
		props.button.setButtonVisible(initBtns, status);
	}
	if (pasteBtns) {
		props.button.setButtonVisible(pasteBtns, !status);
	}
}

const rowCopyPasteUtils = {
	copyRow,
	copyRows,
	pasteRowsToIndex,
	pasteRowsToTail,
	cancel
};

export { rowCopyPasteUtils };
