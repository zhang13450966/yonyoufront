/*
 * @Author: zhangchqf 
 * @PageInfo: 物资需求申请单 list页控制器 
 * @Date: 2018-12-28 10:42:16 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-28 15:51:25
 */

import { STOREREQ_LIST, STOREREQ_LIST_BUTTON, ATTRCODE, FBILLSTATUS } from '../../siconst';

/**
 * //根据单据的状态控制行按钮显示
 * @param {*} fbillstatus  
 */
function setRowButtons(fbillstatus) {
	let buttonAry =
		fbillstatus === FBILLSTATUS.free
			? [
					STOREREQ_LIST_BUTTON.commitRow,
					STOREREQ_LIST_BUTTON.Edit,
					STOREREQ_LIST_BUTTON.deleteRow,
					STOREREQ_LIST_BUTTON.copy,
					STOREREQ_LIST_BUTTON.ApproveInfo
				]
			: fbillstatus === FBILLSTATUS.unapproved
				? [ STOREREQ_LIST_BUTTON.Edit, STOREREQ_LIST_BUTTON.copy, STOREREQ_LIST_BUTTON.ApproveInfo ]
				: fbillstatus === FBILLSTATUS.approve
					? [ STOREREQ_LIST_BUTTON.copy, STOREREQ_LIST_BUTTON.ApproveInfo ]
					: fbillstatus === FBILLSTATUS.approved
						? [ STOREREQ_LIST_BUTTON.copy, STOREREQ_LIST_BUTTON.ApproveInfo ]
						: [ STOREREQ_LIST_BUTTON.copy, STOREREQ_LIST_BUTTON.ApproveInfo ];
	return buttonAry;
}
/**
 * //1.优先根据界面状态判断显示按钮显示
	// 2.再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} tabCode  页签标识
 */
function setListButtonVisiable(props, tabCode) {
	let rows = props.table.getCheckedRows(STOREREQ_LIST.formId);
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
	let Print_list = trueFlag;
	let output = trueFlag;
	let printcountquery = trueFlag;
	let mergeShow = trueFlag;
	if (rows.length > 0) {
		//选择数据时，区分一条或者多选  只有选择数据的时候才控制按钮
		if (rows.length == 1) {
			rows.map((item) => {
				let billStatus = item.data.values.fbillstatus.value; // 单据状态
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
				} else if (billStatus === FBILLSTATUS.other) {
					//关闭
					OpenBill = false;
				} else {
				}
			});
		} else {
			//多条数据时按照页签进行控制
			// if (tabCode == STOREREQ_LIST.toCommit) {//待提交
			// 	Delete = false;
			// 	Commit = false;
			// } else if (tabCode == STOREREQ_LIST.approving) {//审批中
			// 	UnCommit = false;
			// } else if (tabCode == STOREREQ_LIST.executing) {//审批
			// 	UnCommit = false;
			// 	CloseBill = false;
			// } else {
			// 	Delete = false;
			// 	Commit = false;
			// 	CloseBill = false;
			// 	OpenBill = false;
			// 	UnCommit = false;
			// }
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
		Print_list = false;
		output = false;
		printcountquery = false;
		mergeShow = false;
	}
	let disableArr = {
		[STOREREQ_LIST_BUTTON.add]: Add, //新增
		[STOREREQ_LIST_BUTTON.delete]: Delete, //删除
		[STOREREQ_LIST_BUTTON.commit]: Commit, //提交
		[STOREREQ_LIST_BUTTON.uncommit]: UnCommit, //收回
		[STOREREQ_LIST_BUTTON.OpenBill]: OpenBill, //整单打开
		[STOREREQ_LIST_BUTTON.CloseBill]: CloseBill, //整单关闭
		[STOREREQ_LIST_BUTTON.File]: file, //附件
		[STOREREQ_LIST_BUTTON.QueryAboutBusiness]: QueryAboutBusiness, //单据追溯
		[STOREREQ_LIST_BUTTON.Print]: Print, //打印
		[STOREREQ_LIST_BUTTON.Print_list]: Print_list, //打印清单
		[STOREREQ_LIST_BUTTON.output]: output, //输出
		[STOREREQ_LIST_BUTTON.PrintCountQuery]: printcountquery, //输出
		[STOREREQ_LIST_BUTTON.mergeShow]: mergeShow //合并显示
	};
	props.button.setDisabled(disableArr);
}
export default { setRowButtons, setListButtonVisiable };
