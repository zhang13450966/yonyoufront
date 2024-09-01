/*
 * @Author: lichao 
 * @PageInfo: 页面状态控制  
 * @Date: 2019-03-12 15:59:03 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-07-12 09:43:40
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
	//分别设置表格状态
	//props.beforeUpdatePage(AREACODE.cardHead, AREACODE.cardBody);
	if (status == STATUS.browse) {
		props.editTable.setStatus(AREACODE, STATUS.browse);
	} else {
		props.editTable.setStatus(AREACODE, STATUS.edit);
	}
}
