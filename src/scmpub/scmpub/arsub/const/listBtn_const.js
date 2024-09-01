/*
 * @Author: 刘奇 
 * @PageInfo: 列表态按钮控制常量类  
 * @Date: 2019-03-07 18:28:53 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-11-18 13:49:49
 */

import { BUTTON } from './const';
// 卡片浏览态表头显示的全部按钮
const LIST_HEAD_BROWSE_ALLACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.delete,
	BUTTON.commit,
	BUTTON.unCommit,
	BUTTON.pushReceivable,
	BUTTON.pushArsubToGathering,
	BUTTON.closeBill,
	BUTTON.openBill,
	BUTTON.offsetInfo,
	BUTTON.queryAboutBusiness,
	BUTTON.fileManage,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.print,
	BUTTON.Print_list,
	BUTTON.printCountQuery,
	BUTTON.output,
	BUTTON.refresh
];

// 自由态表头可用的按钮
const LIST_HEAD_BROWSE_FREE_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.delete,
	BUTTON.commit,
	BUTTON.fileManage,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.print,
	BUTTON.Print_list,
	BUTTON.printCountQuery,
	BUTTON.output
];

// 审批中表头可用的按钮
const LIST_HEAD_BROWSE_APPROVING_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.unCommit,
	BUTTON.fileManage,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.print,
	BUTTON.Print_list,
	BUTTON.printCountQuery,
	BUTTON.output
];

// 审批通过表头可用的按钮
const LIST_HEAD_BROWSE_AUDIT_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.unCommit,
	BUTTON.pushReceivable,
	BUTTON.pushArsubToGathering,
	BUTTON.closeBill,
	BUTTON.fileManage,
	BUTTON.offsetInfo,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.print,
	BUTTON.Print_list,
	BUTTON.printCountQuery,
	BUTTON.output
];

// 审批不通过表头可用的按钮
const LIST_HEAD_BROWSE_NOPASS_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	// BUTTON.commit, //列表态，只选中一行，如果是审批不通过的单据，表头的提交按钮应置灰，不可用
	BUTTON.fileManage,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.print,
	BUTTON.Print_list,
	BUTTON.printCountQuery,
	BUTTON.output
];
// 关闭表头可用的按钮
const LIST_HEAD_BROWSE_CLOSED_ACTIONS = [
	BUTTON.add,
	BUTTON.add4641,
	BUTTON.add4621,
	BUTTON.fileManage,
	BUTTON.offsetInfo,
	BUTTON.queryAboutBusiness,
	BUTTON.querySettle,
	BUTTON.queryBudget,
	BUTTON.openBill,
	BUTTON.print,
	BUTTON.Print_list,
	BUTTON.printCountQuery,
	BUTTON.output
];

// 无数据表头可用的按钮
const LIST_HEAD_BROWSE_NODATA_ACTIONS = [ BUTTON.add, BUTTON.add4621, BUTTON.add4641 ];

const LIST_HEAD_BROWSE_STATUS_ACTIONS = {
	// 所有
	ALL: LIST_HEAD_BROWSE_ALLACTIONS,
	// 自由态
	I_FREE: LIST_HEAD_BROWSE_FREE_ACTIONS,
	// 审批不通过
	I_NOPASS: LIST_HEAD_BROWSE_NOPASS_ACTIONS,
	// 审批中
	I_AUDITING: LIST_HEAD_BROWSE_APPROVING_ACTIONS,
	// 审批通过
	I_AUDIT: LIST_HEAD_BROWSE_AUDIT_ACTIONS,
	// 单据关闭
	I_CLOSED: LIST_HEAD_BROWSE_CLOSED_ACTIONS,
	// 无数据
	I_NODATA: LIST_HEAD_BROWSE_NODATA_ACTIONS
};

// 销售订单列表下，根据状态不同，显示不同的行按钮
const LIST_INNER_BUTTONS = {
	// 自由态
	I_FREE: [ BUTTON.commit, BUTTON.edit, BUTTON.delete, BUTTON.copy, BUTTON.approveInfo ],
	// 审批不通过
	I_NOPASS: [ BUTTON.edit, BUTTON.copy, BUTTON.approveInfo ],
	// 审批中
	I_AUDITING: [ BUTTON.copy, BUTTON.approveInfo ],
	// 审批通过和关闭
	I_AUDIT: [ BUTTON.copy, BUTTON.approveInfo ]
};
export { LIST_HEAD_BROWSE_STATUS_ACTIONS, LIST_INNER_BUTTONS, BUTTON };
