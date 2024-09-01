/* 
* @Author: lichaoah  
* @PageInfo:统一设定下级编辑后   
* @Date: 2020-02-18 17:05:58  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-29 09:08:06
*/

import { setCardButtonDisable } from '../viewControl/buttonController';
import { TARGET_CARD, EDITSTATUS_BUTTON, TARGET_CARD_BUTTON } from '../../siconst';

export default function(props, moduleId, key, value, oldValue, cardData) {
	let pk_org = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org);
	if (value.value) {
		props.cardTable.setValByKeyAndIndex(TARGET_CARD.target_org, 0, TARGET_CARD.binclowflag, { value: false });
		props.cardTable.setValByKeyAndIndex(TARGET_CARD.target_org, 0, TARGET_CARD.pk_org, pk_org);
		let rows = props.cardTable.getVisibleRows(TARGET_CARD.target_org);
		let deleteIndex = [];
		for (let i in rows) {
			if (i != 0) {
				deleteIndex.push(i);
			}
		}
		props.cardTable.delRowsByIndex(TARGET_CARD.target_org, deleteIndex);
		// props.cardTable.setRowEditByIndex({ tableId: TARGET_CARD.target_org, index: 0, flag: false });
	} else {
		props.cardTable.setValByKeyAndIndex(TARGET_CARD.target_org, 0, TARGET_CARD.binclowflag, { value: true });
		// props.cardTable.setRowEditByIndex({ tableId: TARGET_CARD.target_org, index: 0, flag: true });
	}
	setCardButtonDisable(props);
	//当为是的时候 此时操作列 删除不可见
	if (true == value.value) {
		//当表体没有数据，则新增一条数据
		let rows = props.cardTable.getVisibleRows(TARGET_CARD.target_org);
		if (0 == rows.length) {
			props.cardTable.addRow(TARGET_CARD.target_org, 0, {
				binclowflag: { value: false },
				csaleorgid: { value: pk_org.value, display: pk_org.display }
			});
		}
		props.button.setButtonVisible(TARGET_CARD_BUTTON.InnerDelLine_org, false);
	} else {
		props.button.setButtonVisible(TARGET_CARD_BUTTON.InnerDelLine_org, true);
	}
}
