/* 
* @Author: lichaoah  
* @PageInfo:返利指标设置按钮控制   
* @Date: 2020-02-18 16:06:33  
 * @Last Modified by: songyt13
 * @Last Modified time: 2022-05-24 10:23:25
*/

import { TARGET_CARD, TARGET_CARD_BUTTON, BROWNSTATUS_BUTTON, EDITSTATUS_BUTTON } from '../../siconst';

export default function buttonController(props, status) {
	let flag = true;
	if (status == TARGET_CARD.edit || status == TARGET_CARD.add) {
		flag = false;
		//新增时，执行光标聚焦
		if (status != TARGET_CARD.edit && status != TARGET_CARD.browse) {
			props.executeAutoFocus();
		}
	} else if (status == TARGET_CARD.browse) {
		flag = true;
	} else if (!status) {
		setBlankPageButtons(props);
		return;
	}
	setCardButtonVisiable.call(this, props, flag);
	setCardButtonDisable.call(this, props, status);
}
function setCardButtonVisiable(props, visiable) {
	props.button.setButtonVisible(BROWNSTATUS_BUTTON, visiable);
	props.button.setButtonVisible(EDITSTATUS_BUTTON, !visiable);
	setBackButtonVisiable(props, visiable);
	setCardPaginationVisible(props, visiable);
}
/**
 * 设置返回按钮的可见性
 * @param {*} props
 */
function setBackButtonVisiable(props, visiable) {
	props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: visiable //控制显示返回按钮: true为显示,false为隐藏 ---非必传
	});
}
function setCardPaginationVisible(props, visiable) {
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', visiable);
}
/**
 * //1.设置空白页面的按钮
 * @param {*} props 
 * @param {*} fbillstatus 
 */
function setBlankPageButtons(props) {
	props.button.setButtonVisible(BROWNSTATUS_BUTTON, false);
	props.button.setButtonVisible(EDITSTATUS_BUTTON, false);
	props.button.setButtonVisible([ TARGET_CARD_BUTTON.Add ], true);
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
}
function setCardButtonDisable(props) {
	props.button.setButtonDisabled(
		[ TARGET_CARD_BUTTON.DelLine_org ],
		props.cardTable.getVisibleRows(TARGET_CARD.target_org).length == 0 ||
			props.cardTable.getCheckedRows(TARGET_CARD.target_org).length == 0 ||
			props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.blowsetflag).value
	);
	props.button.setButtonDisabled(
		[ TARGET_CARD_BUTTON.DelLine_mar ],
		props.cardTable.getVisibleRows(TARGET_CARD.target_mar).length == 0 ||
			props.cardTable.getCheckedRows(TARGET_CARD.target_mar).length == 0
	);
	props.button.setButtonDisabled(
		[ TARGET_CARD_BUTTON.DelLine_item ],
		props.cardTable.getVisibleRows(TARGET_CARD.target_item).length == 0 ||
			props.cardTable.getCheckedRows(TARGET_CARD.target_item).length == 0
	);
	props.button.setButtonDisabled(
		[ TARGET_CARD_BUTTON.Addline_org, TARGET_CARD_BUTTON.Addline_mar, TARGET_CARD_BUTTON.Addline_item ],
		!props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org).value
	);
	if (props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org).value) {
		props.button.setButtonDisabled(
			[ TARGET_CARD_BUTTON.Addline_org ],
			props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.blowsetflag).value
		);
	}
}

export { setCardButtonVisiable, setBackButtonVisiable, setBlankPageButtons, setCardButtonDisable };
