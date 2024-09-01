/*
* @Author: jiangfw 
* @PageInfo: 列表按钮状态
* @Date: 2018-08-09 09:57:45 
 * @Last Modified by: yangls7
 * @Last Modified time: 2018-09-25 15:28:49
*/
import { AREA, ALLBUTTON, BUTTONID } from '../../constance';
let tableId = AREA.list;

export default function(props) {
	let selrows = props.editTable.getCheckedRows(tableId);

	if (selrows == undefined || selrows.length == 0) {
		// 除刷新外其他按钮均不可用
		props.button.setButtonDisabled(ALLBUTTON, true);
		props.button.setButtonDisabled([ BUTTONID.Refresh ], false);
	} else if (selrows.length == 1) {
		props.button.setButtonDisabled(ALLBUTTON, true);
		let showBtnAry = [ BUTTONID.QueryAboutBusiness, BUTTONID.Print, BUTTONID.OutPrint, BUTTONID.Refresh ];
		// 选择一个的时候，根据状态判断
		// let nchecknum = selrows[0].data.values.nchecknum; //本次报检主数量
		let isQcEnable = this.state.isQcEnable;
		// let naccumchecknum = selrows[0].data.values.naccumchecknum; //累计报检主数量
		// if (!isQcEnable && nchecknum) {
		// 	// 检验
		// 	if (parseFloat(nchecknum.value) > 0) {
		// 		showBtnAry.push(BUTTONID.QualityCheck);
		// 	}
		// }
		// 检验
		let checkAbleFlag = checkAble(selrows[0], isQcEnable);
		if (checkAbleFlag) {
			showBtnAry.push(BUTTONID.QualityCheck);
		}
		// if (!isQcEnable && naccumchecknum) {
		// 	// 反检
		// 	if (parseFloat(naccumchecknum.value) > 0) {
		// 		showBtnAry.push(BUTTONID.AntiQC);
		// 	}
		// }
		// 反检
		let antiCheckAbleFlag = antiCheckAble(selrows[0], isQcEnable);
		if (antiCheckAbleFlag) {
			showBtnAry.push(BUTTONID.AntiQC);
		}

		props.button.setButtonDisabled(showBtnAry, false);
	} else {
		//多选
		props.button.setButtonDisabled(ALLBUTTON, false);
		let isQcEnable = this.state.isQcEnable;
		// let showBtnAry = [ BUTTONID.QualityCheck, BUTTONID.AntiQC ];
		let showBtnAry = [ BUTTONID.AntiQC ];
		if (isQcEnable) {
			props.button.setButtonDisabled(showBtnAry, true);
		}
	}
}

/**
 * 检验按钮可用性
 * @param {*} props 
 * @param {*} constance 
 */
function checkAble(row, isQcEnable) {
	let invoice = row.data.values;
	let fbillstatus = invoice.fbillstatus.value;
	if (3 != fbillstatus) {
		//未审批通过不可用
		return false;
	}

	// 报检, 并且未返回质检结果
	let naccumchecknum = (invoice.naccumchecknum == null ? { value: 0 } : invoice.naccumchecknum).value; //累计报检主数量
	let nelignum = (invoice.nelignum == null ? { value: 0 } : invoice.nelignum).value; //累计合格主数量
	let nnotelignum = (invoice.nnotelignum == null ? { value: 0 } : invoice.nnotelignum).value; //累计不合格主数量
	let sumnum = parseFloat(nelignum) + parseFloat(nnotelignum);
	if (naccumchecknum > 0 && sumnum == 0) {
		return false;
	}

	// 已经传设备卡片
	if (invoice.bfaflag.value) {
		return false;
	}

	// 先判断质检模块是否启用,再判断对应库存组织是否质检启用;非紧急放行入库数量>0,即根据质检入库
	if (isQcEnable) {
		let naccumstorenum = (invoice.naccumstorenum == null ? { value: 0 } : invoice.naccumstorenum).value; //累计入库主数量
		let naccumletgoinnum = (invoice.naccumletgoinnum == null ? { value: 0 } : invoice.naccumletgoinnum).value; //累计紧急放行入库主数量
		let subnum = parseFloat(naccumstorenum) - parseFloat(naccumletgoinnum);
		if (subnum > 0) {
			return false;
		}
	}

	return true;
}

/**
 * 反检按钮可用性
 * @param {*} props 
 * @param {*} constance 
 */
function antiCheckAble(row, isQcEnable) {
	let invoice = row.data.values;
	// 启用质检模块不可用
	if (isQcEnable) {
		return false;
	}

	let nnotelignum = (invoice.nnotelignum == null ? { value: 0 } : invoice.nnotelignum).value; //累计不合格主数量
	let nelignum = (invoice.nelignum == null ? { value: 0 } : invoice.nelignum).value; //累计合格主数量
	let naccumchecknum = (invoice.naccumchecknum == null ? { value: 0 } : invoice.naccumchecknum).value; //累计报检主数量
	if (nnotelignum > 0 || nelignum > 0 || naccumchecknum > 0) {
		return true;
	}

	return false;
}
