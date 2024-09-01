/*
 *  页面状态控制器
 * @Author: huoyzh
 * @Date: 2019-02-13 10:37:49
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-09-16 16:05:45
 */
import buttonController from './buttonController';
import { STATUS, PAGECODE } from '../../constance';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
const isFunction = fn => {
	return Object.prototype.toString.call(fn) === '[object Function]';
};
export default function(props, status, billStatus, callback) {
	if (status) {
		changeUrlParam(props, { status: status });
	} else {
		status = props.getUrlParam(STATUS.status);
	}
	//1.更新表格状态
	setUIState.call(this, props, status);
	//2.更新按钮状态
	buttonController.call(this, props, status, billStatus);
	//3.浏览态隐藏操作列
	setFieldsVisable.call(this, props, status);
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
	let formStatus = null;
	let meterialStatus = null; //采购物料
	let qualityStatus = null; //优质优价
	if (status == STATUS.browse) {
		formStatus = STATUS.browse;
		meterialStatus = STATUS.browse;
		qualityStatus = qualityStatus;
	} else {
		formStatus = STATUS.edit;
		meterialStatus = STATUS.edit;
		qualityStatus = STATUS.edit;
	}
	//分别设置表格状态
	props.beforeUpdatePage();
	props.form.setFormStatus(PAGECODE.cardhead, formStatus);
	props.cardTable.setStatus(PAGECODE.cardbody, meterialStatus);
	props.cardTable.setStatus(PAGECODE.cardbodyano, qualityStatus);
	props.updatePage(PAGECODE.cardhead, [PAGECODE.cardbody, PAGECODE.cardbodyano]);
}
/**
 * 控制字段显示隐藏
 * @param {*} props
 * @param {*} status
 */
function setFieldsVisable(props, status) {
	//浏览展示操作列
	if (status == STATUS.browse) {
		props.cardTable.showColByKey(PAGECODE.cardbody, 'opr');
		props.cardTable.showColByKey(PAGECODE.cardbodyano, 'opr');
	} else {
		props.cardTable.hideColByKey(PAGECODE.cardbody, 'opr');
		props.cardTable.hideColByKey(PAGECODE.cardbodyano, 'opr');
	}
}
