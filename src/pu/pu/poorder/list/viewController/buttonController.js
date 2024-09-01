import { PAGECODE, LIST_BUTTON, FIELD, BUTTON_DISABLED } from '../../constance';
import { orderBtnControl } from '../../../yyc/ext/yycBtnControl';

/**
 * 采购订单关闭行选择设置按钮的禁用状态
 * @param {*} props
 * @param {*} tabCode
 */
function initButtons(props, tabCode) {
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	if (tabCode != null) {
		rows.length = 0;
	}
	// 初始化全部不可见
	let Delete = BUTTON_DISABLED;
	let Commit = BUTTON_DISABLED;
	let UnCommit = !BUTTON_DISABLED;
	let ApproveInfo = BUTTON_DISABLED;
	let SupplierAp = BUTTON_DISABLED;
	let Freeze = BUTTON_DISABLED;
	let UnFreeze = BUTTON_DISABLED;
	let OpenBill = BUTTON_DISABLED;
	let CloseBill = BUTTON_DISABLED;
	let Annex_Management = BUTTON_DISABLED;
	let QueryAboutBusiness = BUTTON_DISABLED;
	let Arrival_Plan = BUTTON_DISABLED;
	let Payment_Plan = BUTTON_DISABLED;
	let OrderTOSaleBill = BUTTON_DISABLED;
	let Transport_State = BUTTON_DISABLED;
	let PayExecStat = BUTTON_DISABLED;
	let Print = BUTTON_DISABLED;
	let Print_list = BUTTON_DISABLED;
	let PrintOut = BUTTON_DISABLED;
	let PrintOutQuery = BUTTON_DISABLED;
	let ToInformation = BUTTON_DISABLED;
	if (rows.length > 0) {
		let printdis = false;
		if (rows.length == 1) {
			rows.map((item) => {
				let forderstatus = item.data.values.forderstatus.value; // 单据状态
				let bfinalclose = item.data.values.bfinalclose.value; // 最终关闭
				let bfrozen = item.data.values.bfrozen.value; // 冻结
				if (forderstatus == FIELD.free) {
					Delete = false;
					Commit = false;
				} else if (forderstatus == FIELD.free || forderstatus == FIELD.unapproved) {
					UnCommit = true;
				} else if (forderstatus == FIELD.approved) {
					Payment_Plan = false;
					OrderTOSaleBill = false;
					Transport_State = false;
					PayExecStat = false;
				}
				if (bfrozen) {
					UnFreeze = false;
					printdis = true;
				} else {
					Freeze = false;
				}
				if (bfinalclose && forderstatus == FIELD.approved) {
					OpenBill = false;
				} else if (!bfinalclose && forderstatus == FIELD.approved) {
					CloseBill = false;
				}
			});
			Arrival_Plan = false; //单选才可用
		} else {
			Delete = false; //多选不控制
			Commit = false;
			UnCommit = false;
			Freeze = false;
			UnFreeze = false;
			OpenBill = false;
			CloseBill = false;
			Payment_Plan = false; //modify by zhaoypm @2018-10-23 多选时按照第一条数据判断，因此无论多选还是单选“付款计划”按钮都应该可用
			PayExecStat = false;
		}
		ApproveInfo = false; //单选多选都可用
		SupplierAp = false;
		Annex_Management = false;
		QueryAboutBusiness = false;
		Print = printdis;
		PrintOut = printdis;
		Print_list = printdis;
		PrintOutQuery = printdis;
		ToInformation = false;
	} else {
		Delete = true;
		Commit = true;
		UnCommit = true;
		ApproveInfo = true;
		SupplierAp = true;
		Freeze = true;
		UnFreeze = true;
		OpenBill = true;
		CloseBill = true;
		Annex_Management = true;
		QueryAboutBusiness = true;
		Arrival_Plan = true;
		Payment_Plan = true;
		OrderTOSaleBill = true;
		Transport_State = true;
		PayExecStat = true;
		Print = true;
		Print_list = true;
		PrintOut = true;
		PrintOutQuery = true;
	}
	let disableArr = {
		[LIST_BUTTON.Delete]: Delete, //删除
		[LIST_BUTTON.Commit]: Commit, //提交
		[LIST_BUTTON.UnCommit]: UnCommit, //收回
		[LIST_BUTTON.ApproveInfo]: ApproveInfo, //审批
		[LIST_BUTTON.SupplierAp]: SupplierAp, //供应商应付
		[LIST_BUTTON.Freeze]: Freeze, //冻结
		[LIST_BUTTON.UnFreeze]: UnFreeze, //解冻
		[LIST_BUTTON.OpenBill]: OpenBill, //整单打开
		[LIST_BUTTON.CloseBill]: CloseBill, //整单关闭
		[LIST_BUTTON.Annex_Management]: Annex_Management, //附件
		[LIST_BUTTON.QueryAboutBusiness]: QueryAboutBusiness, //单据追溯
		[LIST_BUTTON.Arrival_Plan]: Arrival_Plan, //到货计划
		[LIST_BUTTON.Payment_Plan]: Payment_Plan, //付款计划
		[LIST_BUTTON.OrderTOSaleBill]: OrderTOSaleBill, //生成协同销售订单
		[LIST_BUTTON.Transport_State]: Transport_State, //运输状态
		[LIST_BUTTON.PayExecStat]: PayExecStat, //付款执行情况
		[LIST_BUTTON.Print]: Print, //打印
		[LIST_BUTTON.Print_list]: Print_list, //打印清单
		[LIST_BUTTON.PrintOut]: PrintOut, //输出
		[LIST_BUTTON.printCountQuery]: PrintOut, //输出
		[LIST_BUTTON.ToInformation]: ToInformation //内部交易信息
	};
	props.button.setDisabled(disableArr);
	// --------START---友云采按钮控制--------------
	orderBtnControl(props, { isList: true, listArea: PAGECODE.tableId });
	// --------END--------------------------------
}

function getListOprRowButtons(record) {
	let forderstatus = record && record.forderstatus && record.forderstatus.value;
	let buttonAry = [
		LIST_BUTTON.List_Inner_Commit,
		LIST_BUTTON.Edit,
		LIST_BUTTON.Delete,
		LIST_BUTTON.Copy,
		LIST_BUTTON.ApproveInfo
	];
	if (FIELD.commit == forderstatus || FIELD.approve == forderstatus || FIELD.approved == forderstatus) {
		//提交、正在审批、审批-->复制、收回、查看审批意见
		buttonAry = [ LIST_BUTTON.Copy, LIST_BUTTON.List_Inner_UnCommit, LIST_BUTTON.ApproveInfo ];
	} else if (FIELD.unapproved == forderstatus) {
		//审批不通过-->修改、复制、查看审批意见
		buttonAry = [ LIST_BUTTON.Edit, LIST_BUTTON.Copy, LIST_BUTTON.ApproveInfo ];
	}
	return buttonAry;
}

export default { initButtons, getListOprRowButtons };
