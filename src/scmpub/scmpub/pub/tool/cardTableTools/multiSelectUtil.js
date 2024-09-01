/*
 * cardTable表体多选处理
 * @Author: guozhq 
 * @Date: 2018-08-29 10:06:00 
 * @Last Modified by: guozhq
 * @Last Modified time: 2018-12-10 15:50:26
 */

const SCM_INDEXS = 'scm_indexs';

/**
 * 判断当前返回是不是多选操作
 * @param {*} data 
 */
function isMultiSelect(data) {
	return data.userObject && data.userObject[SCM_INDEXS];
}

/**
 * 处理多选的返回结果
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} data 
 * @param {*} rownoField 行号字段
 * @param {*} i 当前编辑行
 */
function processMultiSelectResult(props, moduleId, data, rownoField, i) {
	if (data && data.userObject && data.userObject[SCM_INDEXS]) {
		let indexs = data.userObject[SCM_INDEXS];
		if (typeof i != 'undefined') {
			processBackAddRowResult(props, moduleId, data, indexs, i);
		} else {
			processFrontAddRowResult(props, moduleId, data, indexs);
		}
	}
}

/**
 * 处理前台增行的逻辑
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} data 
 * @param {*} indexs 
 */
function processFrontAddRowResult(props, moduleId, data, indexs) {
	let array = [];
	indexs.forEach((index) => {
		array.push({ index: index, data: data.billCard.body[moduleId].rows[index] });
	});
	props.cardTable.updateDataByIndexs(moduleId, array);
}

/**
 * 处理后台增行的逻辑
 * @param {} props 
 * @param {*} moduleId 
 * @param {*} data 
 * @param {*} indexs 
 * @param {*} i 
 */
function processBackAddRowResult(props, moduleId, data, indexs, i) {
	let insertArray = [];
	let updateArray = [ { index: i, data: data.billCard.body[moduleId].rows[i] } ];

	indexs.forEach((index) => {
		if (index != i) {
			insertArray.push({ index: index, data: data.billCard.body[moduleId].rows[index] });
		}
	});
	props.cardTable.updateDataByIndexs(moduleId, updateArray);
	props.cardTable.insertDataByIndexs(moduleId, insertArray, true);
}

export { SCM_INDEXS, isMultiSelect, processMultiSelectResult, processBackAddRowResult, processFrontAddRowResult };
