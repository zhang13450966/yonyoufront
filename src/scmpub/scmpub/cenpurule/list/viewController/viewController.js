/*
 * @Author: lichao 
 * @PageInfo: 页面状态控制  
 * @Date: 2019-03-12 16:06:27 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-18 13:51:15
 */
import buttonController from './buttonController';
import { STATUS, BUTTONS, AREACODE, FIELD } from '../../constance';

const isFunction = (fn) => {
	return Object.prototype.toString.call(fn) === '[object Function]';
};
/**
 * 页面状态控制
 * @param {*} props 
 * @param {*} status 状态
 * @param {*} callback 回调函数
 */
export default function(props, status, callback) {
	//1.更新表格状态
	setUIState.call(this, props, status);
	//更新按钮状态
	buttonController.call(this, props, status);
	//浏览态隐藏操作列
	fieldsController.call(this, props, status);
	//执行回调
	if (callback && isFunction(callback)) {
		callback(props);
	}
}
/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	if (status == STATUS.browse) {
		// props.search.setDisabled(AREACODE.search, false);
		props.cardTable.setStatus(AREACODE.listBody, STATUS.browse);
		props.cardTable.setStatus(AREACODE.listHead, STATUS.browse);
	} else {
		props.cardTable.setStatus(AREACODE.listBody, STATUS.edit);
		props.cardTable.setStatus(AREACODE.listHead, STATUS.edit);
		setRowsDisabled.call(this, props, AREACODE.listHead, this.selectIndex);
	}
	this.setState({});
}
/**
 * 控制字段显示隐藏
 * @param {*} props 
 * @param {*} status 
 */
function fieldsController(props, status) {
	//浏览太隐藏操作列
	if (status == STATUS.browse) {
		props.cardTable.hideColByKey(AREACODE.listBody, 'bodyopr');
		props.cardTable.showColByKey(AREACODE.listHead, 'headopr');
	} else {
		//自动增行
		props.cardTable.showColByKey(AREACODE.listBody, 'bodyopr');
		props.cardTable.hideColByKey(AREACODE.listHead, 'headopr');
	}
}
/**
 * 设置行编辑性
 * @param {*} props 
 * @param {*} index 可编辑的行
 */
function setRowsDisabled(props, tableArea, excludeIdex) {
	let rowNum = props.cardTable.getNumberOfRows(tableArea);
	let rowIndex = [];
	for (let i = 0; i <= rowNum; i++) {
		if (excludeIdex != i) rowIndex.push(i);
	}
	props.cardTable.setRowEditByIndex({ tableId: tableArea, index: rowIndex, flag: false });
	props.cardTable.setRowEditByIndex({ tableId: tableArea, index: excludeIdex, flag: true });
	//以下字段不可编辑
	props.cardTable.setEditableByIndex(
		tableArea,
		excludeIdex,
		[ FIELD.pk_marpuclass_name, FIELD.pk_org_name, FIELD.ts, FIELD.pk_cenpurule, FIELD.pk_group ],
		false
	);
}
