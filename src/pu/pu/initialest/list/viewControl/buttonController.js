/*
 * @Author: zhaochyu 
 * @PageInfo: 列表按钮控制
 * @Date: 2019-01-04 14:23:28 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-08 15:43:00
 */
import { LIST_BUTTON, DATASOURCE, FIELD, FBILLSTATUS } from '../../constance';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';

/**
 * 设置返回按钮的可见性
 * @param {*} props
 */
function setBackButtonVisiable(props, param) {}

/**
 * //1.设置空白页面的按钮
 * @param {*} props 
 * @param {*} fbillstatus 
 */
function setBlankPageButtons() {}
/**
 * //1.根据业务流设置新增按钮
 * @param {*} props 
 * @param {*} fbillstatus 
 */
function setAddButtonVisible(props, flag) {
	this.props.button.setButtonVisible([ LIST_BUTTON.Selfmake ], flag);
	setDefData(DATASOURCE.dataSource, FIELD.isSelfMake, flag);
}
/**
 * //1.根据业务流设置拉单按钮
 * @param {*} props 
 * @param {*} fbillstatus 
 */
function setOrderButtonVisible(props, flag) {
	this.props.button.setButtonVisible([ LIST_BUTTON.Puorder ], flag);
	setDefData(DATASOURCE.dataSource, FIELD.isref21, flag);
}
/**
 * //1.根据存在缓冲里的业务流来判断新增和拉单按钮的可见性
 * @param {*} props 
 * @param {*} fbillstatus 
 */
function setAddAndOrderButtonVisible(props) {
	this.props.button.setButtonVisible([ LIST_BUTTON.Selfmake ], getDefData(DATASOURCE.dataSource, FIELD.isSelfMake));
	this.props.button.setButtonVisible([ LIST_BUTTON.Puorder ], getDefData(DATASOURCE.dataSource, FIELD.isref21));
}
/**
 * //根据单据的状态控制行按钮显示
 * @param {*} props
 * * @param {*} record
 * * @param {*} param  
 * * @param {*} index
 *
 */
function setRowButtons(state) {
	// let state = record.fbillstatus.value;
	let buttonAry =
		state === '0'
			? [ LIST_BUTTON.Approve, LIST_BUTTON.Edit, LIST_BUTTON.Delete, LIST_BUTTON.Copy ]
			: [ LIST_BUTTON.Copy, LIST_BUTTON.UnApprove ];
	return buttonAry;
}
/**
 * //根据勾选行控制肩部按钮
 * @param {*} props
 *
 */
function lineSelected(props, tabCode) {
	let rows = props.table.getCheckedRows(FIELD.tableArea);
	if (tabCode == null) {
		rows.length = 0;
	}
	let oldtab = getDefData(DATASOURCE.dataSource, FIELD.btntabcode);
	if (oldtab != null && oldtab != tabCode) {
		rows.length = 0;
	}
	setDefData(DATASOURCE.dataSource, FIELD.btntabcode, tabCode);
	let trueFlag = true;
	// 初始化全部不可见
	let Add = false;
	let Delete = trueFlag;
	let Approve = trueFlag;
	let UnApprove = trueFlag;
	let AttaMange = trueFlag;
	let BillTraceability = trueFlag;
	let Print = trueFlag;
	let output = trueFlag;
	//选择数据时，区分一条或者多选  只有选择数据的时候才控制按钮
	if (rows.length > 1) {
		//批量选择（删除，审批，取消审批按钮都可见）
		Delete = false;
		Approve = false;
		UnApprove = false;
		//无论选择的行数是否大于1，都会有一下按钮可见
		BillTraceability = false;
		AttaMange = false;
		Print = false;
		output = false;
	} else if (rows.length == 1) {
		rows.map((item) => {
			let billStatus = item.data.values.fbillstatus.value; // 单据状态
			//let approver = item.data.values.approver.value; // 审批人
			if (billStatus === FBILLSTATUS.free) {
				//自由
				Delete = false;
				Approve = false;
				UnApprove = true;
			} else if (billStatus === FBILLSTATUS.approved) {
				//审批通过
				Delete = true;
				Approve = true;
				UnApprove = false;
			}
		});
		//无论选择的行数是否大于1，都会有一下按钮可见
		BillTraceability = false;
		AttaMange = false;
		Print = false;
		output = false;
	}

	let disableArr = {
		[LIST_BUTTON.add]: Add,
		[LIST_BUTTON.Delete]: Delete,
		[LIST_BUTTON.Approve]: Approve,
		[LIST_BUTTON.UnApprove]: UnApprove,
		[LIST_BUTTON.AttaMange]: AttaMange,
		[LIST_BUTTON.BillTraceability]: BillTraceability,
		[LIST_BUTTON.Print]: Print,
		[LIST_BUTTON.Output]: output
	};
	props.button.setDisabled(disableArr);
}
export default {
	setRowButtons,
	setAddButtonVisible,
	setOrderButtonVisible,
	setAddAndOrderButtonVisible,
	setBackButtonVisiable,
	setBlankPageButtons,
	lineSelected
};
