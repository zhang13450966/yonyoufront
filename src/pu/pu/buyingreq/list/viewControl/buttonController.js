/*
 * @Author: zhangchqf
 * @PageInfo: 请购单 list页控制器
 * @Date: 2018-12-28 10:42:16
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-28 16:42:32
 */

import { BUYINGREQ_LIST, BUYINGREQ_CARD, BUYINGREQ_LIST_BUTTON, ATTRCODE, ATTRCODES, FBILLSTATUS } from '../../siconst';
import { reqBtnControl } from '../../../yyc/ext/yycBtnControl';

/**
 * //根据单据的状态控制行按钮显示
 * @param {*} state
 */
function setRowButtons(state) {
	let buttonAry =
		state === '0'
			? [
					BUYINGREQ_LIST_BUTTON.commitRow,
					BUYINGREQ_LIST_BUTTON.Edit,
					BUYINGREQ_LIST_BUTTON.deleteRow,
					BUYINGREQ_LIST_BUTTON.copy,
					BUYINGREQ_LIST_BUTTON.ApproveInfo
				]
			: state === '4'
				? [ BUYINGREQ_LIST_BUTTON.Edit, BUYINGREQ_LIST_BUTTON.copy, BUYINGREQ_LIST_BUTTON.ApproveInfo ]
				: state === '2'
					? [ BUYINGREQ_LIST_BUTTON.copy, BUYINGREQ_LIST_BUTTON.ApproveInfo ]
					: state === '3'
						? [ BUYINGREQ_LIST_BUTTON.CloseBill, BUYINGREQ_LIST_BUTTON.copy, BUYINGREQ_LIST_BUTTON.ApproveInfo ]
						: state === '5'
							? [ BUYINGREQ_LIST_BUTTON.OpenBill, BUYINGREQ_LIST_BUTTON.copy, BUYINGREQ_LIST_BUTTON.ApproveInfo ]
							: [ BUYINGREQ_LIST_BUTTON.copy, BUYINGREQ_LIST_BUTTON.ApproveInfo ];
	return buttonAry;
}
/**
 * //1.优先根据界面状态判断显示按钮显示
	// 2.再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} tabCode  页签标识
 */
function setListButtonVisiable(props, tabCode) {
	let rows = props.table.getCheckedRows(BUYINGREQ_LIST.formId);
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
			// if (tabCode == BUYINGREQ_LIST.toCommit) {//待提交
			// 	Delete = false;
			// 	Commit = false;
			// } else if (tabCode == BUYINGREQ_LIST.approving) {//审批中
			// 	UnCommit = false;
			// } else if (tabCode == BUYINGREQ_LIST.executing) {//审批
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
	}
	let disableArr = {
		[BUYINGREQ_LIST_BUTTON.add]: Add, //新增
		[BUYINGREQ_LIST_BUTTON.delete]: Delete, //删除
		[BUYINGREQ_LIST_BUTTON.commit]: Commit, //提交
		[BUYINGREQ_LIST_BUTTON.uncommit]: UnCommit, //收回
		[BUYINGREQ_LIST_BUTTON.OpenBill]: OpenBill, //整单打开
		[BUYINGREQ_LIST_BUTTON.CloseBill]: CloseBill, //整单关闭
		[BUYINGREQ_LIST_BUTTON.File]: file, //附件
		[BUYINGREQ_LIST_BUTTON.QueryAboutBusiness]: QueryAboutBusiness, //单据追溯
		[BUYINGREQ_LIST_BUTTON.Print]: Print, //打印
		[BUYINGREQ_LIST_BUTTON.Print_list]: Print_list, //打印
		[BUYINGREQ_LIST_BUTTON.output]: Print,
		[BUYINGREQ_LIST_BUTTON.PrintCountQuery]: Print
	};
	props.button.setDisabled(disableArr);
	// --------START---友云采按钮控制--------------
	reqBtnControl(props, { isList: true, listArea: BUYINGREQ_LIST.formId });
	// --------END--------------------------------
}
export default { setRowButtons, setListButtonVisiable };
