/*
 * @Author: 王勇 
 * @PageInfo: 卡片-按钮状态＆可视性　控制  
 * @Date: 2020-01-17 09:42:54 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-01 13:11:26
 */

import { VIEWINFO, CARDBUTTONINFO, ROUTEVOINFO, CARDTEMPLATEINFO } from '../../const/index';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function(props, status) {
	// let flag = props.form.getFormStatus(CARDTEMPLATEINFO.headAreaCode)
	let isBrowse = status === VIEWINFO.BROWSER_STATUS;
	//1.设置界面状态
	setUIState.call(this, props, status);
	// 2.设置按钮的显示隐藏
	setTableButtonVisiable.call(this, props, isBrowse);
	// 3.设置按钮可用性
	setTableButtonEnable.call(this, props, isBrowse, status);
}

/**
 * 控制按钮可见性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonVisiable(props, isBrowse) {
	if (isBrowse) {
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
		let flag = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.bsealflag).value;
		props.button.setButtonsVisible({
			[CARDBUTTONINFO.editBtnCode]: true,
			[CARDBUTTONINFO.printBtnCode]: true,
			[CARDBUTTONINFO.outputBtnCode]: true,
			[CARDBUTTONINFO.refreshBtnCode]: true,

			[CARDBUTTONINFO.copyBtnCode]: true,
			[CARDBUTTONINFO.delBtnCode]: true,
			[CARDBUTTONINFO.addBtnCode]: true,

			[CARDBUTTONINFO.StartUse]: flag,
			[CARDBUTTONINFO.StopUse]: !flag,

			[CARDBUTTONINFO.saveBtnCode]: false,
			[CARDBUTTONINFO.cancelBtnCode]: false,
			[CARDBUTTONINFO.innerAddLineBtnCode]: false,
			[CARDBUTTONINFO.delLineBtnCode]: false,
			[CARDBUTTONINFO.innerDelLineBtnCode]: false,
			[CARDBUTTONINFO.innerInsLineBtnCode]: false
		});
		props.button.setPopContent(
			CARDBUTTONINFO.innerDelLineBtnCode,
			getLangByResId(this, '4001ROUTE-000041')
		); /* 国际化处理： 确认要删除吗？*/
	} else {
		// 新增态按钮控制
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		props.button.setButtonsVisible({
			[CARDBUTTONINFO.editBtnCode]: false,
			[CARDBUTTONINFO.printBtnCode]: false,
			[CARDBUTTONINFO.outputBtnCode]: false,
			[CARDBUTTONINFO.refreshBtnCode]: false,

			[CARDBUTTONINFO.copyBtnCode]: false,
			[CARDBUTTONINFO.delBtnCode]: false,
			[CARDBUTTONINFO.addBtnCode]: false,

			[CARDBUTTONINFO.enableBtnCode]: false,
			[CARDBUTTONINFO.disableBtnCode]: false,

			[CARDBUTTONINFO.saveBtnCode]: true,
			[CARDBUTTONINFO.cancelBtnCode]: true,
			[CARDBUTTONINFO.innerAddLineBtnCode]: true,
			[CARDBUTTONINFO.delLineBtnCode]: true,
			[CARDBUTTONINFO.innerDelLineBtnCode]: true,
			[CARDBUTTONINFO.innerInsLineBtnCode]: true
		});
		props.button.setPopContent(CARDBUTTONINFO.innerDelLineBtnCode, '');
	}
}

/**
 * 控制按钮可用性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonEnable(props, isBrowse, status) {
	//浏览态
	if (isBrowse) {
		//设置返回按钮是否显示
		this.setState({
			backStatus: true
		});
		// props.cardTable.setAllCheckboxAble(CARDTEMPLATEINFO.bodyAreaCode,false);
		let flag = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.bsealflag).value;
		//设置可用
		props.button.setDisabled({
			[CARDBUTTONINFO.editBtnCode]: false,
			[CARDBUTTONINFO.printBtnCode]: false,
			[CARDBUTTONINFO.outputBtnCode]: false,
			[CARDBUTTONINFO.refreshBtnCode]: false,

			[CARDBUTTONINFO.copyBtnCode]: false,
			[CARDBUTTONINFO.delBtnCode]: false,
			[CARDBUTTONINFO.addBtnCode]: false,

			[CARDBUTTONINFO.StartUse]: !flag,
			[CARDBUTTONINFO.StopUse]: flag,

			[CARDBUTTONINFO.saveBtnCode]: true,
			[CARDBUTTONINFO.cancelBtnCode]: true,
			[CARDBUTTONINFO.innerAddLineBtnCode]: true,
			//	[CARDBUTTONINFO.delLineBtnCode]: true,
			[CARDBUTTONINFO.innerDelLineBtnCode]: true,
			[CARDBUTTONINFO.innerInsLineBtnCode]: true
		});
	} else {
		//编辑态-设置不可用
		//设置返回按钮是否显示
		this.setState({
			backStatus: false
		});
		props.button.setDisabled({
			[CARDBUTTONINFO.editBtnCode]: true,
			[CARDBUTTONINFO.printBtnCode]: true,
			[CARDBUTTONINFO.outputBtnCode]: true,
			[CARDBUTTONINFO.refreshBtnCode]: true,

			[CARDBUTTONINFO.copyBtnCode]: true,
			[CARDBUTTONINFO.delBtnCode]: true,
			[CARDBUTTONINFO.addBtnCode]: true,

			[CARDBUTTONINFO.enableBtnCode]: true,
			[CARDBUTTONINFO.disableBtnCode]: true,

			[CARDBUTTONINFO.saveBtnCode]: false,
			[CARDBUTTONINFO.cancelBtnCode]: false,
			[CARDBUTTONINFO.innerAddLineBtnCode]: false,
			//	[CARDBUTTONINFO.delLineBtnCode]: false,
			[CARDBUTTONINFO.innerDelLineBtnCode]: false,
			[CARDBUTTONINFO.innerInsLineBtnCode]: false
		});
		let selrow = props.cardTable.getCheckedRows(CARDTEMPLATEINFO.bodyAreaCode);
		if (selrow.length > 0) {
			props.button.setDisabled({
				[CARDBUTTONINFO.delLineBtnCode]: false
			});
		} else {
			props.button.setDisabled({
				[CARDBUTTONINFO.delLineBtnCode]: true
			});
		}
	}
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status 
 */
function setUIState(props, status) {
	props.form.setFormStatus(CARDTEMPLATEINFO.headAreaCode, status);
	props.cardTable.setStatus(CARDTEMPLATEINFO.bodyAreaCode, status);
}

function setBlankPageButtons(props, status) {
	setUIState.call(this, props, status);
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	props.button.setButtonVisible([ CARDBUTTONINFO.addBtnCode ], true);
	props.button.setButtonVisible({
		[CARDBUTTONINFO.editBtnCode]: false,
		[CARDBUTTONINFO.printBtnCode]: false,
		[CARDBUTTONINFO.outputBtnCode]: false,
		[CARDBUTTONINFO.refreshBtnCode]: false,
		[CARDBUTTONINFO.copyBtnCode]: false,
		[CARDBUTTONINFO.delBtnCode]: false,
		[CARDBUTTONINFO.enableBtnCode]: false,
		[CARDBUTTONINFO.disableBtnCode]: false,
		[CARDBUTTONINFO.saveBtnCode]: false,
		[CARDBUTTONINFO.cancelBtnCode]: false,
		[CARDBUTTONINFO.innerAddLineBtnCode]: false,
		[CARDBUTTONINFO.delLineBtnCode]: false,
		[CARDBUTTONINFO.innerDelLineBtnCode]: false,
		[CARDBUTTONINFO.innerInsLineBtnCode]: false
	});
}

export { setBlankPageButtons };
