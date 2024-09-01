/*
 * @Author: zhangchqf 
 * @PageInfo: 请购单 list页控制器 
 * @Date: 2018-12-28 10:42:16 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-06-30 09:57:22
 */

import { BUYINGREQ_LIST, BUYINGREQ_CARD, BUYINGREQ_LIST_BUTTON, ATTRCODE, ATTRCODES, FBILLSTATUS } from '../../siconst';
import { reqArrangeBtnControl } from '../../../yyc/ext/yycBtnControl';

/**
 * //根据版本号控制行按钮显示
 * @param {*} nversion  
 */
function setRowButtons(nversion) {
	let buttonAry = [];
	if (nversion > 1) {
		buttonAry = [ BUYINGREQ_LIST_BUTTON.Revise, BUYINGREQ_LIST_BUTTON.ReviseHistory ];
	} else {
		buttonAry = [ BUYINGREQ_LIST_BUTTON.Revise ];
	}
	return buttonAry;
}
/**
 * //1.根据当前转台判断按钮显示
 * @param {*} props
 * @param {*} status
 */
function setListButtonVisiable(props, status) {
	if (status === BUYINGREQ_LIST.browse) {
		//浏览
		this.props.editTable.setStatus(BUYINGREQ_LIST.formId, BUYINGREQ_LIST.browse);
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_LIST_BUTTON.Edit,
				BUYINGREQ_LIST_BUTTON.BatchArrange,
				BUYINGREQ_LIST_BUTTON.CancelArrange,
				BUYINGREQ_LIST_BUTTON.Refresh
			],
			true
		);
		this.props.button.setButtonVisible([ BUYINGREQ_LIST_BUTTON.Cancel, BUYINGREQ_LIST_BUTTON.Save ], false);
	} else if (status === BUYINGREQ_LIST.edit) {
		//编辑
		this.props.editTable.setStatus(BUYINGREQ_LIST.formId, BUYINGREQ_LIST.edit);
		this.props.button.setButtonVisible([ BUYINGREQ_LIST_BUTTON.Save, BUYINGREQ_LIST_BUTTON.Cancel ], true);
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_LIST_BUTTON.Edit,
				BUYINGREQ_LIST_BUTTON.BatchArrange,
				BUYINGREQ_LIST_BUTTON.CancelArrange,
				BUYINGREQ_LIST_BUTTON.Refresh
			],
			false
		);
		//设置按钮未可编辑
		let disableArr = {
			[BUYINGREQ_LIST_BUTTON.Cancel]: false, //取消
			[BUYINGREQ_LIST_BUTTON.Save]: false, //保存
			[BUYINGREQ_LIST_BUTTON.Refresh]: false //刷新
		};
		this.props.button.setDisabled(disableArr);
	} else {
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_LIST_BUTTON.Edit,
				BUYINGREQ_LIST_BUTTON.BatchArrange,
				BUYINGREQ_LIST_BUTTON.CancelArrange,
				BUYINGREQ_LIST_BUTTON.Refresh
			],
			true
		);
		this.props.button.setButtonVisible([ BUYINGREQ_LIST_BUTTON.Cancel, BUYINGREQ_LIST_BUTTON.Save ], false);
	}
}
/**
 * //1.初始化显示按钮
 * @param {*} props 
 */
function setButtonVisible(props) {
	props.button.setButtonVisible(
		[
			BUYINGREQ_LIST_BUTTON.Edit,
			BUYINGREQ_LIST_BUTTON.BatchArrange,
			BUYINGREQ_LIST_BUTTON.CancelArrange,
			BUYINGREQ_LIST_BUTTON.Refresh
		],
		true
	);
	props.button.setButtonVisible([ BUYINGREQ_LIST_BUTTON.Cancel, BUYINGREQ_LIST_BUTTON.Save ], false);
}
/**
 * //1.初始化按钮是否可用
 * @param {*} props 
 */
function setButtonDisabled(props) {
	let disableArr = {
		[BUYINGREQ_LIST_BUTTON.Edit]: true, //安排
		[BUYINGREQ_LIST_BUTTON.BatchArrange]: true, //批量安排
		[BUYINGREQ_LIST_BUTTON.CancelArrange]: true, //取消安排
		[BUYINGREQ_LIST_BUTTON.Refresh]: true, //刷新
		[BUYINGREQ_LIST_BUTTON.Cancel]: true, //取消
		[BUYINGREQ_LIST_BUTTON.Save]: true //保存
	};
	props.button.setDisabled(disableArr);
	// --------START---友云采按钮控制--------------
	reqArrangeBtnControl(props, { tableArea: BUYINGREQ_LIST.formId });
	// --------END--------------------------------
}
/**
 * //1.设置按钮可用性
 * @param {*} props
 * @param {*} flag
 */
function initButtons(props, flag) {
	if (!this.state.showSearch) {
		return;
	}
	// 初始化全部不可见
	let Edit = true;
	let BatchArrange = true;
	let CancelArrange = true;
	let Refresh = false;
	let Cancel = true;
	let Save = true;
	//判断标志为true则为：查询已安排数据；为false：查询未安排数据
	if (flag == true) {
		CancelArrange = false;
	} else {
		Edit = false;
		let checkData = props.editTable.getCheckedRows(BUYINGREQ_LIST.formId);
		if (checkData.length > 0) {
			BatchArrange = false;
		}
	}

	let disableArr = {
		[BUYINGREQ_LIST_BUTTON.Edit]: Edit, //安排
		[BUYINGREQ_LIST_BUTTON.BatchArrange]: BatchArrange, //批量安排
		[BUYINGREQ_LIST_BUTTON.CancelArrange]: CancelArrange, //取消安排
		[BUYINGREQ_LIST_BUTTON.Refresh]: Refresh, //刷新
		[BUYINGREQ_LIST_BUTTON.Cancel]: Cancel, //取消
		[BUYINGREQ_LIST_BUTTON.Save]: Save //保存
	};
	props.button.setDisabled(disableArr);
	// --------START---友云采按钮控制--------------
	reqArrangeBtnControl(props, { tableArea: BUYINGREQ_LIST.formId });
	// --------END--------------------------------
}
/**
 * //清空批量设置里的字段的缓存
 */
function setState() {
	//清空缓存中的值
	this.setState({
		showModal: false,
		purchaseorg_v: {},
		employee: {},
		pk_suggestsupplier_v: {}
	});
}
export default { setRowButtons, setListButtonVisiable, setButtonVisible, setButtonDisabled, initButtons, setState };
