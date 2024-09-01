/*
* @Author: jiangfw 
* @PageInfo: 列表按钮状态
* @Date: 2018-08-09 09:57:45 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-05-24 16:02:26
*/
import { AREA, FIELD, BILLSTATUS, BUTTONID, COMMON } from '../../constance/index';
import {
	LIST_HEAD_ALL_ACTIONS,
	LIST_HEAD_NODATA_ACTIONS,
	LIST_HEAD_FREE_ACTIONS,
	LIST_HEAD_NOPASS_ACTIONS,
	LIST_HEAD_APPROVING_ACTIONS,
	LIST_HEAD_AUDIT_ACTIONS
} from '../../constance/listBtnConst';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getAddBtnVisable } from '../../utils/getAddBtnVisable';
let tableId = AREA.list_head;

export default function(props) {
	let selrows = props.table.getCheckedRows(tableId);

	if (selrows == undefined || selrows.length == 0) {
		props.button.setButtonDisabled(LIST_HEAD_ALL_ACTIONS, true);
		// 除了新增，刷新，其他按钮不可用
		props.button.setButtonDisabled(LIST_HEAD_NODATA_ACTIONS, false);
	} else if (selrows.length == 1) {
		// 选择一个的时候，根据状态判断
		props.button.setButtonDisabled(LIST_HEAD_ALL_ACTIONS, true);

		// 设置费用发票、联查费用发票可用性
		let feeFlag = selrows[0].data.values[FIELD.bfee].value; //费用发票标志
		props.button.setButtonDisabled([ BUTTONID.FeeInvoice, BUTTONID.LinkQueryFeeInvoice ,BUTTONID.InvoiceDzfp], feeFlag);

		let showBtnAry = getDisabledBtnArray(props);
		// 冻结、解冻
		let freezeFlag = selrows[0].data.values[FIELD.bfrozen].value; //冻结标志
		let freezeBtn = freezeFlag == true ? BUTTONID.UnFreeze : BUTTONID.Freeze;
		showBtnAry.push(freezeBtn);
		// 传应付、取消传应付
		let billstatus = selrows[0].data.values[FIELD.fbillstatus].value;
		if (BILLSTATUS.approve == billstatus) {
			let apFlag = selrows[0].data.values[FIELD.bapflag].value; //传应付标志
			let apBtn = apFlag == true ? BUTTONID.CancelSendAp : BUTTONID.SendAp;
			showBtnAry.push(apBtn);
			props.button.setButtonDisabled([ BUTTONID.FeeInvoice ], true);
		}
		props.button.setButtonDisabled(showBtnAry, false);
	} else {
		let showBtnAry = LIST_HEAD_ALL_ACTIONS;
		let index = showBtnAry.indexOf(BUTTONID.FeeInvoice);
		showBtnAry.splice(index, 1);

		// 设置费用发票、联查费用发票可用性
		let feeFlag = selrows[0].data.values[FIELD.bfee].value; //费用发票标志
		props.button.setButtonDisabled([ BUTTONID.FeeInvoice, BUTTONID.LinkQueryFeeInvoice,BUTTONID.InvoiceDzfp ], feeFlag);
		let billstatus = selrows[0].data.values[FIELD.fbillstatus].value;
		if (BILLSTATUS.approve == billstatus) {
			props.button.setButtonDisabled([ BUTTONID.FeeInvoice ], true);
		}

		props.button.setButtonDisabled(showBtnAry, false);
	}

	// 交易类型发布的小应用新增按钮可用性
	let refBillTypeInfo = getDefData(COMMON.PuinvoiceCacheKey, COMMON.RefBillTypeInfo);
	let btnMap = getAddBtnVisable(refBillTypeInfo);
	let visableBtnArry = btnMap.get('Y');
	let disVisableBtnAry = btnMap.get('N');
	if (visableBtnArry && visableBtnArry.length > 0) {
		props.button.setButtonVisible(visableBtnArry, true);
	}
	if (disVisableBtnAry && disVisableBtnAry.length) {
		props.button.setButtonVisible(disVisableBtnAry, false);
	}
}

function getDisabledBtnArray(props) {
	let selrows = props.table.getCheckedRows(tableId);
	let billstatus = selrows[0].data.values[FIELD.fbillstatus].value;

	switch (billstatus) {
		// 自由态按钮
		case BILLSTATUS.free:
			return [].concat(LIST_HEAD_FREE_ACTIONS);

		// 审批不通过
		case BILLSTATUS.nopass:
			return [].concat(LIST_HEAD_NOPASS_ACTIONS);

		// 审批中
		case BILLSTATUS.approving:
			return [].concat(LIST_HEAD_APPROVING_ACTIONS);

		// 审批通过
		case BILLSTATUS.approve:
			return [].concat(LIST_HEAD_AUDIT_ACTIONS);

		default:
			return '';
	}
}
