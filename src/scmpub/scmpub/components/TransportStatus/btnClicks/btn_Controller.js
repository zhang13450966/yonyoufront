/*
 * @Author: wangceb 
 * @PageInfo: 按钮的状态控制
 * 包括显示隐藏，可用性
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: wangshrc
 * @Last Modified time: 2018-10-12 14:21:12
 */

const ALL_ROWBTN_CODE = [ 'LineClose', 'LineOpen' ];
const ALL_BILLBTN_CODE = [ 'BillClose', 'BillOpen' ];

import { TRANSPORTSTATUS_CONST } from '../const';

export default function btnCtrl(props) {
	// 行按钮可用性与勾选框选中相关
	let selrows = props.table.getCheckedRows(TRANSPORTSTATUS_CONST.TABLEID);

	if (selrows == undefined || selrows.length == 0) {
		props.button.setButtonDisabled(ALL_ROWBTN_CODE, true);
		// 选择一个的时候，根据状态判断
	} else if (selrows.length == 1) {
		props.button.setButtonDisabled(ALL_ROWBTN_CODE, true);
		props.button.setButtonDisabled(getDisabledBtnArray(props), false);
	} else {
		props.button.setButtonDisabled(ALL_ROWBTN_CODE, true);
		props.button.setButtonDisabled(getDisabledBtnArray(props), false);
	}

	// 整单按钮与界面上数据的状态有关系
	let allrows = props.table.getAllTableData(TRANSPORTSTATUS_CONST.TABLEID).rows;

	let status = {};
	allrows.forEach((rowdata) => {
		let bsendendflag = rowdata.values.bsendendflag.value;
		status[bsendendflag] = rowdata;
	});

	props.button.setButtonDisabled(ALL_BILLBTN_CODE, true);
	if (status[true] == undefined) {
		// 全是运输打开状态的行，整单关闭可用
		props.button.setButtonDisabled([ 'BillClose' ], false);
	} else if (status[false] == undefined) {
		// 全是运输关闭状态的行，整单打开可用
		props.button.setButtonDisabled([ 'BillOpen' ], false);
	} else {
		props.button.setButtonDisabled([ 'BillClose', 'BillOpen' ], false);
	}
}

function getDisabledBtnArray(props) {
	let selrows = props.table.getCheckedRows(TRANSPORTSTATUS_CONST.TABLEID);
	let hasClosed = false;
	let hasOpened = false;
	for (let i = 0; i < selrows.length; i++) {
		let bsendendflag = selrows[i].data.values.bsendendflag.value;
		if (bsendendflag) hasClosed = true;
		else hasOpened = true;
	}
	if (hasClosed && hasOpened) {
		return [ 'LineOpen', 'LineClose' ];
	} else if (hasClosed && !hasOpened) {
		return [ 'LineOpen' ];
	} else {
		return [ 'LineClose' ];
	}
}
