/*
 * @Author: chaiwx 
 * @PageInfo: 编辑后事件-表头  
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-12 11:26:33
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FIELDS, PAGECODE, REQUESTURL } from '../../constance';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props, moduleId, key, value, oldVal, refInfo) {
	// 触发编辑后的字段
	let editItems = [ FIELDS.cemployeeid, FIELDS.dstartdate, FIELDS.denddate, FIELDS.dbilldate ];

	if (editItems.includes(key)) {
		if (key === FIELDS.dstartdate || key === FIELDS.denddate) {
			let dstartdate = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.dstartdate).value;
			let denddate = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.denddate).value;
			if (dstartdate > denddate) {
				showWarningInfo(null, getLangByResId(this, '4004comarebill-000036')); /* 国际化处理： 结束日期不能小于开始日期*/
				props.form.setFormItemsValue(moduleId, {
					[key]: { value: oldVal.value }
				});
			}
		} else {
			let data = createHeadAfterEventData(
				props,
				PAGECODE.cardPagecode,
				AREA.cardFormId,
				AREA.cardTableId,
				moduleId,
				key,
				value
			);
			doAction.call(this, props, data, key);
		}
	}
}

function doAction(props, data, key) {
	ajax({
		url: REQUESTURL.headAfterEdit,
		data: data,
		async: false,
		success: (res) => {
			if (res.data) {
				processBillCardHeadEditResult(props, AREA.cardFormId, AREA.cardTableId, res.data);
			}
		}
	});
}
