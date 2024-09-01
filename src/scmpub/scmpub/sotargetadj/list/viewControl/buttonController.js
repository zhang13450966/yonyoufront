/*
 * @Author: zhangchqf
 * @PageInfo: 请购单 list页控制器
 * @Date: 2018-12-28 10:42:16
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:05:04
 */

import { TARGETADJ_LIST, TARGETADJ_LIST_BUTTON, FBILLSTATUS } from '../../siconst';

/**
 * //根据单据的状态控制行按钮显示
 * @param {*} state
 */
function setRowButtons(state) {
	let buttonAry =
		state === '0'
			? [
					TARGETADJ_LIST_BUTTON.commitRow,
					TARGETADJ_LIST_BUTTON.EditRow,
					TARGETADJ_LIST_BUTTON.deleteRow,
					TARGETADJ_LIST_BUTTON.ApproveInfo
				]
			: state === '2'
				? [ TARGETADJ_LIST_BUTTON.EditRow, TARGETADJ_LIST_BUTTON.ApproveInfo ]
				: state === '1'
					? [ TARGETADJ_LIST_BUTTON.uncommit, TARGETADJ_LIST_BUTTON.ApproveInfo ]
					: [ TARGETADJ_LIST_BUTTON.ApproveInfo ];
	return buttonAry;
}
/**
 * //1.优先根据界面状态判断显示按钮显示
	// 2.再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} tabCode  页签标识
 */
function setListButtonVisiable(props, tabCode) {
	let rows = props.table.getCheckedRows(TARGETADJ_LIST.formId);
	if (tabCode == null) {
		rows.length = 0;
	}
	let trueFlag = true;
	// 初始化全部不可见
	let Add = false;
	let Delete = trueFlag;
	let Commit = trueFlag;
	let UnCommit = trueFlag;
	let OpenBill = trueFlag;
	let CloseBill = trueFlag;
	let file = trueFlag;
	let QueryAboutBusiness = trueFlag;
	let Print = trueFlag;

	if (rows.length > 0) {
		//选择数据时，区分一条或者多选  只有选择数据的时候才控制按钮
		if (rows.length == 1) {
			rows.map((item) => {
				let billStatus = item.data.values.fstatusflag.value; // 单据状态
				let approver = item.data.values.approver.value; // 审批人
				if (billStatus === FBILLSTATUS.free) {
					//自由
					Delete = false;
					Commit = false;
				} else if (billStatus === FBILLSTATUS.approve && approver == undefined) {
					//审批中
					UnCommit = false;
				} else if (billStatus === FBILLSTATUS.approved) {
					//审批
					UnCommit = false;
					CloseBill = false;
				} else if (billStatus === FBILLSTATUS.unapproved) {
					//审批不通过
					Delete = false;
				} else {
				}
			});
		} else {
			//批选时不按照页签控制了
			Delete = false;
			Commit = false;
			CloseBill = false;
			OpenBill = false;
			UnCommit = false;
		}
		file = false;
		QueryAboutBusiness = false;
		Print = false;
	}
	let disableArr = {
		[TARGETADJ_LIST_BUTTON.add]: Add, //新增
		[TARGETADJ_LIST_BUTTON.delete]: Delete, //删除
		[TARGETADJ_LIST_BUTTON.commit]: Commit, //提交
		[TARGETADJ_LIST_BUTTON.uncommit]: UnCommit, //收回
		[TARGETADJ_LIST_BUTTON.OpenBill]: OpenBill, //整单打开
		[TARGETADJ_LIST_BUTTON.CloseBill]: CloseBill, //整单关闭
		[TARGETADJ_LIST_BUTTON.File]: file, //附件
		[TARGETADJ_LIST_BUTTON.QueryAboutBusiness]: QueryAboutBusiness, //单据追溯
		[TARGETADJ_LIST_BUTTON.Print]: Print, //打印
		[TARGETADJ_LIST_BUTTON.output]: Print
	};
	props.button.setDisabled(disableArr);
}
export default { setRowButtons, setListButtonVisiable };
