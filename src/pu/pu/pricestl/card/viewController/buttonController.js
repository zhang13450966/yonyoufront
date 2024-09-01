/*
 * 按钮可用性控制器
 * @Author: huoyzh 
 * @Date: 2019-02-13 11:09:32 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2019-03-14 14:20:46
 */
import { STATUS, BUTTON, PAGECODE, FIELD } from '../../constance';
export default function(props, status, billStatus) {
	if (!status) {
		status = props.getUrlParam(STATUS.status);
	}
	// 2.设置按钮的显示隐藏
	setCardButtonVisiable.call(this, props, status, billStatus);
	// 3.设置主按钮
	setMainButton.call(this, props);
	// 4.返回按钮的显示隐藏
	setBackButtonVisiable.call(this, props, status);
	// 5.设置卡片分页器的显示隐藏
	setCardPaginationVisible.call(this, props, status);
}
/**
 * 设置按钮的显示隐藏
 * @param {*} props 
 * @param {*} status 
 */
function setCardButtonVisiable(props, status, billStatus) {
	//1. 表头按钮
	//2.编辑态显示的
	let headEditBtns = [ BUTTON.Save, BUTTON.Cancel, BUTTON.Save_Commit ];
	//3.浏览态根据单据的状态来显示的
	let headBrowsBtns = [
		BUTTON.Add,
		BUTTON.Delete,
		BUTTON.Edit,
		BUTTON.Print,
		BUTTON.PrintOut,
		BUTTON.Refresh,
		BUTTON.Commit,
		BUTTON.UnCommit
	];
	let auticheckBtns = [ BUTTON.Save, BUTTON.Cancel ];
	//2.表体肩上的按钮
	let shoulderBtn = [ BUTTON.openmeterialbrowse, BUTTON.openqualitybrowse ];
	let scene = props.getUrlParam('scene');
	if (status == STATUS.edit) {
		if (billStatus) {
			if (billStatus == '0' || billStatus == '4') {
				props.button.setButtonVisible(headBrowsBtns, false);
				props.button.setButtonVisible(headEditBtns, true);
			}
			//审批中,编辑态
			if (billStatus == '2' && scene != null && scene == 'approvesce') {
				props.button.setButtonVisible(auticheckBtns, true);
				props.button.setButtonVisible(headBrowsBtns, false);
			}
		}
	} else if (status == STATUS.browse) {
		if (!props.getUrlParam('id')) {
			props.button.setButtonVisible(headBrowsBtns, false);
			props.button.setButtonVisible(BUTTON.Add, true);
		}
		if (billStatus) {
			//自由
			if (billStatus == '0') {
				props.button.setButtonVisible(
					[
						BUTTON.Add,
						BUTTON.Edit,
						BUTTON.Delete,
						BUTTON.Commit,
						BUTTON.Print,
						BUTTON.PrintOut,
						BUTTON.Refresh
					],
					true
				);
				props.button.setButtonVisible(
					[ BUTTON.Save, BUTTON.UnCommit, BUTTON.Save_Commit, BUTTON.Cancel ],
					false
				);
			} else if (billStatus == '4') {
				//审批不通过
				props.button.setButtonVisible(
					[ BUTTON.Add, BUTTON.Edit, BUTTON.Print, BUTTON.PrintOut, BUTTON.Refresh ],
					true
				);
				props.button.setButtonVisible(
					[ BUTTON.Save, BUTTON.UnCommit, BUTTON.Commit, BUTTON.Save_Commit, BUTTON.Cancel, BUTTON.Delete ],
					false
				);
			} else if (billStatus == '2') {
				//审批中
				//
				props.button.setButtonVisible(
					[ BUTTON.Add, BUTTON.UnCommit, BUTTON.Print, BUTTON.PrintOut, BUTTON.Refresh ],
					true
				);
				props.button.setButtonVisible(
					[ BUTTON.Save, BUTTON.Edit, BUTTON.Save_Commit, BUTTON.Commit, BUTTON.Cancel, BUTTON.Delete ],
					false
				);
				if (scene != null && scene == 'approvesce') {
					props.button.setButtonVisible(BUTTON.Edit, true);
				}
			} else if (billStatus == '3') {
				//审批通过
				props.button.setButtonVisible(
					[ BUTTON.Add, BUTTON.UnCommit, BUTTON.Print, BUTTON.PrintOut, BUTTON.Refresh ],
					true
				);
				props.button.setButtonVisible(
					[
						BUTTON.Delete,
						BUTTON.Save_Commit,
						BUTTON.Commit,
						BUTTON.Edit,
						BUTTON.Save,
						BUTTON.Cancel,
						BUTTON.Delete
					],
					false
				);
			}
		}
		if (scene && scene == 'approvesce') {
			props.button.setButtonVisible([ BUTTON.Add, BUTTON.Commit, BUTTON.UnCommit ], false);
		}
	}
}
/**
 * 设置主按钮
 * @param {*} props 
 */
function setMainButton(props) {}
/**
 * 返回按钮的显示隐藏
 */
function setBackButtonVisiable(props, status) {
	let isShowReturn = true;
	let scene = props.getUrlParam('scene');
	//编辑态不显示返回
	if (status != STATUS.browse) {
		isShowReturn = false;
	}
	if (scene && scene == 'approvesce') {
		isShowReturn = false;
	}
	props.BillHeadInfo.setBillHeadInfoVisible({
		showBillCode: true,
		showBackBtn: isShowReturn, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
		billCode: props.form.getFormItemsValue([ PAGECODE.cardhead ], FIELD.vbillcode).value
	});
}
/**
 * 设置卡片分页器的显示隐藏
 * @param {*} props 
 */
function setCardPaginationVisible(props, status) {
	let id = props.getUrlParam('id');
	let isShowPagination = true;
	//编辑态不显示分页器
	if (status != STATUS.browse) {
		isShowPagination = false;
	}
	if (status == STATUS.browse && !id) {
		isShowPagination = false;
	}
	let scene = props.getUrlParam('scene');
	if (scene && scene == 'approvesce') {
		isShowPagination = false;
	}
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', isShowPagination);
}
