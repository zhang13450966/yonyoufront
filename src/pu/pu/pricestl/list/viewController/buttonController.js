/*
 * 按钮可用性控制器
 * @Author: huoyzh 
 * @Date: 2019-02-15 13:24:11 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2019-02-15 14:27:09
 */
import { PAGECODE, BUTTON, FIELD, LIST_BUTTON } from '../../constance';
function initButtons(props, tabCode) {
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	if (tabCode != null) {
		rows.length = 0;
	}
	// 初始化全部不可见
	let Delete = true;
	let Commit = true;
	let UnCommit = true;
	let Print = false;
	let PrintOut = false;
	let Refresh = false;
	if (rows.length > 0) {
		if (rows.length == 1) {
			rows.map((item) => {
				let forderstatus = item.data.values.fbillstatus.value; // 单据状态
				if (forderstatus == FIELD.free) {
					Delete = false;
					Commit = false;
				} else if (forderstatus == FIELD.approve || forderstatus == FIELD.approved) {
					UnCommit = false;
				}
			});
		} else {
			Delete = false; //多选不控制
			Commit = false;
			UnCommit = false;
		}
		Print = false;
		PrintOut = false;
	} else {
		Delete = true;
		Commit = true;
		UnCommit = true;
		// Print = false;
		// PrintOut = false;
		Print = true;
		PrintOut = true;
		Refresh = false;
	}
	let disableArr = {
		[BUTTON.Delete]: Delete, //删除
		[BUTTON.Commit]: Commit, //提交
		[BUTTON.UnCommit]: UnCommit, //收回
		[BUTTON.Print]: Print, //打印
		[BUTTON.PrintOut]: PrintOut, //输出
		[BUTTON.Refresh]: Refresh //刷新
	};
	props.button.setDisabled(disableArr);
}
function getListOprRowButtons(record) {
	let fbillstatus = record && record.fbillstatus && record.fbillstatus.value;
	let buttonAry = [
		LIST_BUTTON.List_Inner_Commit, //行提交
		LIST_BUTTON.List_Inner_Edit, //行修改
		LIST_BUTTON.List_Inner_Delete, //行删除
		LIST_BUTTON.List_Inner_UnCommit, //行收回
		LIST_BUTTON.List_Inner_ApproveInfo //行查看审批意见
	];
	if (FIELD.free == fbillstatus) {
		//自由-->可以提交、修改、删除、查看审批意见
		buttonAry = [
			LIST_BUTTON.List_Inner_Commit, //提交
			LIST_BUTTON.List_Inner_Edit, //行修改
			LIST_BUTTON.List_Inner_Delete, //行删除
			LIST_BUTTON.List_Inner_ApproveInfo //行查看审批意见
		];
	} else if (FIELD.unapproved == fbillstatus) {
		//审批不通过-->修改、审批详情
		buttonAry = [ LIST_BUTTON.List_Inner_Edit, LIST_BUTTON.List_Inner_ApproveInfo ];
	} else if (FIELD.approve == fbillstatus) {
		//审批中-->审批详情
		buttonAry = [ LIST_BUTTON.List_Inner_ApproveInfo ];
	} else if (FIELD.approved == fbillstatus) {
		//审批通过-->收回、审批详情
		buttonAry = [ LIST_BUTTON.List_Inner_UnCommit, LIST_BUTTON.List_Inner_ApproveInfo ];
	}
	return buttonAry;
}
export default { initButtons, getListOprRowButtons };
