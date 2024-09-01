/*
 * @Author: zhangchqf 
 * @PageInfo: 请购单 list页控制器 
 * @Date: 2018-12-28 10:42:16 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-11-13 15:23:11
 */

import { BUYINGREQ_LIST, BUYINGREQ_CARD, BUYINGREQ_LIST_BUTTON, ATTRCODE, ATTRCODES, FBILLSTATUS } from '../../siconst';

/**
 * //根据版本号判断修订历史按钮是否展示
 * //根据单据状态控制行按钮显示
 * @param {*} nversion  
 * @param {*} fbillstatus  
 */
function setRowButtons(nversion, fbillstatus) {
	let buttonAry = [];
	// 自由态
	if (fbillstatus == FBILLSTATUS.free) {
		buttonAry = [
			BUYINGREQ_LIST_BUTTON.Revise,
			BUYINGREQ_LIST_BUTTON.commit,
			nversion > 1 ? BUYINGREQ_LIST_BUTTON.ReviseHistory : null,
			BUYINGREQ_LIST_BUTTON.ReviseDelete,
			BUYINGREQ_LIST_BUTTON.ApproveInfo
		];
	} else if (fbillstatus == FBILLSTATUS.unapproved) {
		// 审批不通过
		buttonAry = [
			BUYINGREQ_LIST_BUTTON.Revise,
			nversion > 1 ? BUYINGREQ_LIST_BUTTON.ReviseHistory : null,
			BUYINGREQ_LIST_BUTTON.ReviseDelete,
			BUYINGREQ_LIST_BUTTON.ApproveInfo
		];
	} else if (fbillstatus == FBILLSTATUS.approve) {
		// 审批中
		buttonAry = [ nversion > 1 ? BUYINGREQ_LIST_BUTTON.ReviseHistory : null, BUYINGREQ_LIST_BUTTON.ApproveInfo ];
	} else {
		// 审批通过
		buttonAry = [
			BUYINGREQ_LIST_BUTTON.Revise,
			nversion > 1 ? BUYINGREQ_LIST_BUTTON.ReviseHistory : null,
			BUYINGREQ_LIST_BUTTON.ApproveInfo
		];
	}
	return buttonAry;
}
/**
 * //1.优先根据界面状态判断显示按钮显示
	// 2.再根据单据状态控制按钮显示
 * @param {*} props  
 */
function setListButtonVisiable(props) {
	let rows = props.table.getCheckedRows(BUYINGREQ_LIST.formId);
	let trueFlag = true;
	let File = trueFlag;
	let QueryAboutBusiness = trueFlag;
	let Print = trueFlag;
	let output = trueFlag;
	let commit = trueFlag;
	let uncommit = trueFlag;
	let reviseDelete = trueFlag;
	if (rows.length > 0) {
		//选择数据时，区分一条或者多选
		if (rows.length == 1) {
			let billStatus = rows[0].data.values.fbillstatus.value; // 单据状态
			let approver = rows[0].data.values.approver.value; // 审批人
			if (billStatus === FBILLSTATUS.free) {
				//自由
				commit = false;
				reviseDelete = false;
			} else if (billStatus === FBILLSTATUS.unapproved) {
				//审批不通过
				reviseDelete = false;
			} else if (billStatus === FBILLSTATUS.approve && approver == undefined) {
				//审批中并且审批人为0时
				uncommit = false;
			}
		} else {
			//多选
			commit = false;
			uncommit = false;
			reviseDelete = false;
		}
		File = false;
		QueryAboutBusiness = false;
		Print = false;
		output = false;
	}
	let disableArrdef = {
		[BUYINGREQ_LIST_BUTTON.File]: File, //附件
		[BUYINGREQ_LIST_BUTTON.QueryAboutBusiness]: QueryAboutBusiness, //单据追溯
		[BUYINGREQ_LIST_BUTTON.Print]: Print, //打印
		[BUYINGREQ_LIST_BUTTON.output]: output, //输出
		[BUYINGREQ_LIST_BUTTON.PrintCountQuery]: Print, //打印次数查询
		[BUYINGREQ_LIST_BUTTON.commit]: commit, //提交
		[BUYINGREQ_LIST_BUTTON.uncommit]: uncommit, //收回
		[BUYINGREQ_LIST_BUTTON.ReviseDelete]: reviseDelete, //修订删除
		[BUYINGREQ_LIST_BUTTON.Refresh]: false //刷新
	};
	props.button.setDisabled(disableArrdef);
}
export default { setRowButtons, setListButtonVisiable };
