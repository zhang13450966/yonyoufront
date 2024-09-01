/*
 * @Author: zhangchqf 
 * @PageInfo: 销售指标设置 list页控制器 
 * @Date: 2018-12-28 10:42:16 
 * @Last Modified by: qishy
 * @Last Modified time: 2020-08-11 14:29:11
 */

import { TARGET_LIST, TARGET_LIST_BUTTON } from '../../siconst';

/**
 * //根据版本号控制行按钮显示
 * @param {*}   
 */
function setRowButtons() {
	let buttonAry = [ TARGET_LIST_BUTTON.Edit, TARGET_LIST_BUTTON.deleteRow ];
	return buttonAry;
}
/**
 * //1.优先根据界面状态判断显示按钮显示
	// 2.再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} flag  
 */
function setListButtonVisiable(props, flag) {
	let rows = props.table.getCheckedRows(TARGET_LIST.formId);
	let trueFlag = true;
	if (rows && rows.length > 0) {
		trueFlag = false;
	}
	//初始化按钮都为不可用
	let disableArrdef = {
		[TARGET_LIST_BUTTON.delete]: trueFlag, //删除
		[TARGET_LIST_BUTTON.File]: trueFlag, //附件
		[TARGET_LIST_BUTTON.QueryAboutBusiness]: trueFlag, //保存
		[TARGET_LIST_BUTTON.Print]: trueFlag, //打印
		[TARGET_LIST_BUTTON.output]: trueFlag //输出
	};
	props.button.setDisabled(disableArrdef);
}
export default { setRowButtons, setListButtonVisiable };
