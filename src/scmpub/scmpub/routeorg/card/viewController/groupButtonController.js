/*
 * @Author: 王勇 
 * @PageInfo: 组织节点数据为集团数据时-按钮状态 控制  
 * @Date: 2020-01-17 09:53:20 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-01 13:09:39
 */
import { ROUTEVOINFO, CARDBUTTONINFO, CARDTEMPLATEINFO, VIEWINFO } from '../../const/index';

export default function(props) {
	//1.设置界面状态
	setUIState.call(this, props);
	// 2.设置按钮的显示隐藏
	setTableButtonVisiable.call(this, props);
	// 3.设置按钮可用性
	setTableButtonEnable.call(this, props);
}

/**
 * 控制按钮可见性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonVisiable(props) {
	this.setState({
		backStatus: true
	});

	let data = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.bsealflag);
	let flag = true;
	if (data) {
		flag = data.value;
	}
	// props.cardTable.setAllCheckboxAble(CARDTEMPLATEINFO.bodyAreaCode,false);
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);

	props.button.setButtonsVisible({
		[CARDBUTTONINFO.addBtnCode]: true,
		[CARDBUTTONINFO.editBtnCode]: true,
		[CARDBUTTONINFO.printBtnCode]: true,
		[CARDBUTTONINFO.outputBtnCode]: true,
		[CARDBUTTONINFO.refreshBtnCode]: true,
		[CARDBUTTONINFO.StartUse]: flag,
		[CARDBUTTONINFO.StopUse]: !flag,
		[CARDBUTTONINFO.saveBtnCode]: false,
		[CARDBUTTONINFO.cancelBtnCode]: false,
		[CARDBUTTONINFO.delBtnCode]: true,
		[CARDBUTTONINFO.copyBtnCode]: true,
		[CARDBUTTONINFO.innerAddLineBtnCode]: false,
		[CARDBUTTONINFO.innerDelLineBtnCode]: false,
		[CARDBUTTONINFO.delLineBtnCode]: false
	});
	// props.button.setPopContent(CARDBUTTONINFO.innerDelBtnCode, '');
}

/**
 * 控制按钮可用性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonEnable(props) {
	props.button.setDisabled({
		[CARDBUTTONINFO.addBtnCode]: false,
		[CARDBUTTONINFO.editBtnCode]: true,
		[CARDBUTTONINFO.printBtnCode]: false,
		[CARDBUTTONINFO.outputBtnCode]: false,
		[CARDBUTTONINFO.refreshBtnCode]: false,

		[CARDBUTTONINFO.StartUse]: true,
		[CARDBUTTONINFO.StopUse]: true,
		[CARDBUTTONINFO.saveBtnCode]: true,
		[CARDBUTTONINFO.cancelBtnCode]: true,
		[CARDBUTTONINFO.delBtnCode]: true,
		[CARDBUTTONINFO.copyBtnCode]: true,
		[CARDBUTTONINFO.innerAddLineBtnCode]: true,
		[CARDBUTTONINFO.innerDelLineBtnCode]: true,
		[CARDBUTTONINFO.delLineBtnCode]: true
	});
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status 
 */
function setUIState(props) {
	props.form.setFormStatus(CARDTEMPLATEINFO.headAreaCode, VIEWINFO.BROWSER_STATUS);
	props.cardTable.setStatus(CARDTEMPLATEINFO.bodyAreaCode, VIEWINFO.BROWSER_STATUS);
}
