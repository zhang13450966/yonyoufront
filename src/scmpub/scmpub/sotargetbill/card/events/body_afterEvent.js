/*
 * @Author: gaoxiaoqiang 
 * @PageInfo: 表体编辑后事件 
 * @Date: 2019-04-18 10:25:15 
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-18 16:18:16
 */

import { ajax } from 'nc-lightapp-front';
import { TARGETBILL_CONST } from '../../const';
import {
	createBodyAfterEventData,
	processBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { processCardTableAutoAddRow } from '../../../../../scmpub/scmpub/pub/tool/autoAddRowUtil';
import clickAddRowBtn from '../btnClicks/addRow_BtnClick';
let pagecode = TARGETBILL_CONST.cardPageId;
let tableId = TARGETBILL_CONST.tableId;
let formId = TARGETBILL_CONST.formId;
export default function bodyAfterEvent(props, moduleId, key, value, changedrows, i, record) {
	if (key == 'ccustomerid' || key.indexOf('year') != -1) {
		// 如果值未改变，不走编辑事件
		let ischange = false;
		changedrows.forEach((element) => {
			if (JSON.stringify(element.newvalue.value || {}) != JSON.stringify(element.oldvalue.value || {})) {
				ischange = true;
				return;
			}
		});
		if (!ischange) {
			return;
		}

		let eventData = createBodyAfterEventData(props, pagecode, formId, tableId, moduleId, key, changedrows, i);
		ajax({
			url: TARGETBILL_CONST.bodyafter,
			data: eventData,
			async: false,
			success: (res) => {
				if (res.data) {
					this.clinkyearitemidFlag = res.data.userObject.clinkyearitemidFlag;
					this.props.beforeUpdatePage();
					if (res.data.billCard.head) {
						props.form.setAllFormValue({ [formId]: res.data.billCard.head[formId] });
					}
					if (res.data.billCard.body) {
						processBillCardBodyEditResult(props, moduleId, res.data, i);
					}
					this.props.updatePage(formId, tableId);
					processCardTableAutoAddRow(props, tableId, i, {
						isMuli: changedrows.length > 1 ? true : false,
						autoAddFunc: clickAddRowBtn.bind(this, props),
						hasCrownoField: false
					});
				}
			}
		});
	}
}
