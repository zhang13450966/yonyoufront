/*
 * 友云采按钮控制
 * @Author: guozhq 
 * @Date: 2019-05-20 16:21:30 
 * @Last Modified by: guozhq
 * @Last Modified time: 2019-05-29 10:28:19
 */
import { YYC_BUTTON_ARRAY } from '../constance';
import { isYYC } from './yycBtnInit';

function reqBtnControl(props, { isList, isCard, listArea, cardHeadArea, billStatusField }) {
	if (isYYC()) {
		if (isCard) {
			// 根据状态判断是否显示按钮
			let status = props.getUrlParam('status');
			let billstatus = props.form.getFormItemsValue(cardHeadArea, billStatusField).value;
			if (status === 'browse' && billstatus == '3') {
				props.button.setButtonVisible(YYC_BUTTON_ARRAY, true);
			} else {
				props.button.setButtonVisible(YYC_BUTTON_ARRAY, false);
			}
		}
		if (isList) {
			let rows = props.table.getCheckedRows(listArea);
			if (rows.length > 0) {
				props.button.setDisabled(YYC_BUTTON_ARRAY, false);
			} else {
				props.button.setDisabled(YYC_BUTTON_ARRAY, true);
			}
		}
	}
}

/**
 * 采购订单按钮状态控制
 * @param {*} props 
 * @param {*} param
 */
function orderBtnControl(props, { isList, isCard, listArea, cardHeadArea, billStatusField, pk_orderField, status }) {
	if (isYYC()) {
		if (isCard) {
			// 根据状态判断是否显示按钮
			// let status = props.getUrlParam('status');
			let billstatus = props.form.getFormItemsValue(cardHeadArea, billStatusField).value;
			let pk_order = props.form.getFormItemsValue(cardHeadArea, pk_orderField).value;
			// 自由状态可用
			if (status === 'browse' && billstatus == '0' && pk_order != null) {
				props.button.setButtonVisible(YYC_BUTTON_ARRAY, true);
			} else {
				props.button.setButtonVisible(YYC_BUTTON_ARRAY, false);
			}
		}
		if (isList) {
			let rows = props.table.getCheckedRows(listArea);
			if (rows.length > 0) {
				props.button.setDisabled(YYC_BUTTON_ARRAY, false);
			} else {
				props.button.setDisabled(YYC_BUTTON_ARRAY, true);
			}
		}
	}
}

/**
 * 请购安排按钮控制
 * @param {*} props 
 * @param {*} param1 
 */
function reqArrangeBtnControl(props, { tableArea }) {
	if (isYYC()) {
		// 根据状态判断是否显示按钮
		let rows = props.editTable.getCheckedRows(tableArea);
		if (rows.length > 0) {
			props.button.setDisabled(YYC_BUTTON_ARRAY, false);
		} else {
			props.button.setDisabled(YYC_BUTTON_ARRAY, true);
		}
	}
}

export { reqBtnControl, orderBtnControl, reqArrangeBtnControl };
