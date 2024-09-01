/*
 * @Author: 刘奇 
 * @PageInfo: 卡片态按钮控制常量类  
 * @Date: 2019-03-07 18:28:28 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-11-18 12:15:25
 */

import { BUTTON } from './const';
// 卡片浏览态表头显示的全部按钮
const CARD_HEAD_ALL_ALLACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.edit,
	BUTTON.delete,
	BUTTON.copy,
	BUTTON.commit,
	BUTTON.save,
	BUTTON.cancel,
	BUTTON.saveCommit,
	BUTTON.unCommit,
	BUTTON.pushReceivable,
	BUTTON.pushArsubToGathering,
	BUTTON.closeBill,
	BUTTON.openBill,
	BUTTON.fileManage,
	BUTTON.offsetInfo,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.approveInfo,
	BUTTON.print,
	BUTTON.output,
	BUTTON.refresh
];

// 卡片浏览态自由态表头显示的按钮
const CARD_HEAD_BROWSE_FREE_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.edit,
	BUTTON.delete,
	BUTTON.copy,
	BUTTON.commit,
	BUTTON.fileManage,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.approveInfo,
	BUTTON.print,
	BUTTON.output,
	BUTTON.refresh
];

// 卡片浏览态审批中表头显示的按钮
const CARD_HEAD_BROWSE_APPROVING_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.copy,
	BUTTON.unCommit,
	BUTTON.fileManage,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.approveInfo,
	BUTTON.print,
	BUTTON.output,
	BUTTON.refresh
];

// 卡片浏览态审批通过表头显示的按钮
const CARD_HEAD_BROWSE_AUDIT_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.copy,
	BUTTON.unCommit,
	BUTTON.pushReceivable,
	BUTTON.pushArsubToGathering,
	BUTTON.closeBill,
	BUTTON.fileManage,
	BUTTON.offsetInfo,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.approveInfo,
	BUTTON.print,
	BUTTON.output,
	BUTTON.refresh
];
// 卡片浏览态关闭表头显示的按钮
const CARD_HEAD_BROWSE_CLOSED_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.copy,
	BUTTON.openBill,
	BUTTON.fileManage,
	BUTTON.offsetInfo,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.approveInfo,
	BUTTON.print,
	BUTTON.output,
	BUTTON.refresh
];
// 卡片浏览态审批不通过表头显示的按钮
const CARD_HEAD_BROWSE_NOPASS_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.copy,
	// BUTTON.commit,// 审批不通过的单据需要隐藏提交按钮
	BUTTON.fileManage,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.approveInfo,
	BUTTON.print,
	BUTTON.output,
	BUTTON.refresh,
	BUTTON.edit
];

const CARD_HEAD_EDIT_ACTIONS = [ BUTTON.save, BUTTON.saveCommit, BUTTON.cancel ];

const CARD_HEAD_REF_ACTIONS = [ BUTTON.addGroup, BUTTON.copy ];

const CARD_HEAD_STATUS_ACTIONS = {
	// 所有
	ALL: CARD_HEAD_ALL_ALLACTIONS,
	// 自由态
	I_FREE: CARD_HEAD_BROWSE_FREE_ACTIONS,
	// 审批不通过
	I_NOPASS: CARD_HEAD_BROWSE_NOPASS_ACTIONS,
	// 审批中
	I_AUDITING: CARD_HEAD_BROWSE_APPROVING_ACTIONS,
	// 审批通过
	I_AUDIT: CARD_HEAD_BROWSE_AUDIT_ACTIONS,
	//关闭
	I_CLOSED: CARD_HEAD_BROWSE_CLOSED_ACTIONS,
	// 编辑态
	EDIT: CARD_HEAD_EDIT_ACTIONS,
	// 转单浏览态不显示的按钮
	REF: CARD_HEAD_REF_ACTIONS
};

// 卡片肩部全的按钮
const CARD_BODY_ALL_BUTTONS = [
	BUTTON.addLine,
	BUTTON.deleteLine,
	BUTTON.copyLine,
	BUTTON.resetRowNo,
	BUTTON.canelCopy,
	BUTTON.pasteLineToTail
];
// 卡片编辑态，肩部显示的按钮
const CARD_BODY_EDIT_BUTTONS = [ BUTTON.addLine, BUTTON.deleteLine, BUTTON.copyLine, BUTTON.resetRowNo ];
// 卡片复制时，肩部显示的按钮
const CARD_BODY_PASTE_BUTTONS = [ BUTTON.canelCopy, BUTTON.pasteLineToTail ];
// 卡片浏览态，肩部显示的按钮
const CARD_BODY_BROWSE_BUTTONS = [];
// 卡片编辑态，表体没数据时可用的按钮
const CARD_BODY_NOROW_BUTTONS = [ BUTTON.addLine ];
// 卡片编辑态，表体有数据没选中时可用的按钮
const CARD_BODY_NOSELECT_BUTTONS = [ BUTTON.addLine, BUTTON.resetRowNo ];

const CARD_BODY_BUTTONS = {
	ALL: CARD_BODY_ALL_BUTTONS,
	EDIT: CARD_BODY_EDIT_BUTTONS,
	PASTE: CARD_BODY_PASTE_BUTTONS,
	BROWSE: CARD_BODY_BROWSE_BUTTONS,
	NOROW: CARD_BODY_NOROW_BUTTONS,
	NOSELECT: CARD_BODY_NOSELECT_BUTTONS
};

// 卡片浏览态，操作列显示的按钮
const CARD_BODY_INNER_BROWSE_BUTTONS = [ BUTTON.spread ];

// 卡片编辑态，操作列显示的按钮
const CARD_BODY_INNER_EDIT_BUTTONS = [ BUTTON.spread, BUTTON.deleteLine, BUTTON.copyLine, BUTTON.insertLine ];
// 卡片复制，操作列显示的按钮
const CARD_BODY_INNER_COPY_BUTTONS = [ BUTTON.pasteLine ];

const CARD_BODY_INNER_BUTTONS = {
	EDIT: CARD_BODY_INNER_EDIT_BUTTONS,
	BROWSE: CARD_BODY_INNER_BROWSE_BUTTONS,
	COPY: CARD_BODY_INNER_COPY_BUTTONS
};
export { CARD_BODY_BUTTONS, CARD_BODY_INNER_BUTTONS, CARD_HEAD_STATUS_ACTIONS };
