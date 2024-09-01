/*设置按钮的禁用状态
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 20:34:03 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-07-29 00:19:57
 */

import { STOREREQ_LIST_BUTTON, STOREREQ_LIST, FBILLSTATUS } from '../../siconst';

export default function initButtons(props, tabCode) {
	
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
	let output = trueFlag;
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
		output = false;
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
		[STOREREQ_LIST_BUTTON.output]: output, //输出
		[STOREREQ_LIST_BUTTON.mergeShow]: mergeShow //合并显示
	};
	props.button.setDisabled(disableArr);
}
