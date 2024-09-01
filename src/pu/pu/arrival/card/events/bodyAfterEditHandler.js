/*
 * @Author: ligangt 
 * @PageInfo: 处理表体编辑后事件 
 * @Date: 2018-05-02 15:05:25 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-06-24 17:51:00
 */

import { AREA, FREEFIELD, PAGECODE, URL, FIELD } from './../../constance';
import { ajax, base } from 'nc-lightapp-front';
import { marAsstUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { processBatchCodeValue } from '../../../pub/utils/batchCodeUtil';
import {
	createBodyAfterEventData,
	processBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
export default function(props, moduleId, key, value, changedrows, record, index) {
	if (
		changedrows &&
		changedrows[0].oldvalue &&
		changedrows[0].newvalue &&
		changedrows[0].oldvalue.value == changedrows[0].newvalue.value
	) {
		return;
	}
	switch (key) {
		case 'bpresent':
			presentFlag(props, moduleId, key, value, changedrows, record, index);
			break;
		case 'vchangerate':
			changeRate(props, moduleId, key, value, changedrows, record, index);
			break;
		case 'castunitid':
			astUnit(props, moduleId, key, value, changedrows, record, index);
			break;
		case 'pk_receivestore':
			receiveStore(props, moduleId, key, value, changedrows, record, index);
			break;
		case 'dproducedate':
		case 'ivalidday':
			produceDate(props, moduleId, key, value, changedrows, record, index);
			break;
		case 'pk_material':
			material(props, moduleId, key, value, changedrows, record, index);
			break;
		case 'nnum':
		case 'nastnum':
		case 'nplannum':
		case 'nplanastnum':
		case 'nwastnum':
		case 'nwastastnum':
		case 'npresentnum':
		case 'npresentastnum':
			num(props, moduleId, key, value, changedrows, record, index);
			break;
		case 'vbatchcode':
			batchcode(props, moduleId, key, value, changedrows, record, index);
			break;
		case 'cprojectid':
			cProject(props, moduleId, key, value, changedrows, record, index);
			break;
		case 'vfree1':
		case 'vfree2':
		case 'vfree3':
		case 'vfree4':
		case 'vfree5':
		case 'vfree6':
		case 'vfree7':
		case 'vfree8':
		case 'vfree9':
		case 'vfree10':
		case 'casscustid':
		case 'casscustvid':
		case 'cproductorid':
		case 'cprojectid':
			marAsstUtils.afterEdit.call(
				this,
				props,
				null,
				PAGECODE.card,
				moduleId,
				key,
				'pk_material',
				record,
				index,
				FREEFIELD
			);
			break;
		default:
			break;
	}
}

function material(props, moduleId, key, value, changedrows, record, index) {
	postEvent(props, moduleId, key, value, changedrows, record, index);
}

function batchcode(props, moduleId, key, value, changedrows, record, index) {
	let CLEARFIELDS = [
		'crowno', //行号
		'nnum',
		'pk_arriveorder_b'
	];
	let userobject = processBatchCodeValue(props, moduleId, value, CLEARFIELDS);
	if (!userobject) {
		props.cardTable.setValByKeyAndIndex(moduleId, index, 'vbatchcode', {
			value: null,
			display: null
		});
		props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_batchcode', {
			value: null,
			display: null
		});
		return;
	}
	let datav = createBodyAfterEventData(
		props,
		PAGECODE.card,
		AREA.form,
		AREA.body,
		moduleId,
		key,
		changedrows,
		index,
		userobject
	);
	// let _this = this;
	ajax({
		url: URL.afterBodyEdit,
		data: datav,
		async: false,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg, //参数一：返回的公式对象
					{
						//参数二：界面使用的表格类型
						card_body: 'cardTable'
					}
				);
			}
			processBillCardBodyEditResult(props, moduleId, res.data, index);
			if (key === 'vbatchcode') {
				RownoUtils.setRowNo(props, AREA.body, FIELD.crowno);
			}
			// _this.forceUpdate();
			//cachedata.call(this, moduleId);
		}
	});
}

function num(props, moduleId, key, value, changedrows, record, index) {
	postEvent(props, moduleId, key, value, changedrows, record, index);
}

function changeRate(props, moduleId, key, value, changedrows, record, index) {
	postEvent(props, moduleId, key, value, changedrows, record, index);
}

function produceDate(props, moduleId, key, value, changedrows, record, index) {
	postEvent(props, moduleId, key, value, changedrows, record, index);
}

function presentFlag(props, moduleId, key, value, changedrows, record, index) {
	if (value) {
		let nnum = record.values.nnum.value;
		props.cardTable.setValByKeyAndIndex(AREA.body, index, 'nnum', { value: nnum, display: nnum, scale: 0 });
		let nastnum = record.values.nastnum.value;
		props.cardTable.setValByKeyAndIndex(AREA.body, index, 'nastnum', { value: nastnum });
	} else {
		props.cardTable.setValByKeyAndIndex(AREA.body, index, 'npresentastnum', { value: null });
		props.cardTable.setValByKeyAndIndex(AREA.body, index, 'npresentnum', { value: null });
	}
	props.form.setFormStatus(AREA.head, 'edit');
	props.cardTable.setStatus(AREA.body, 'edit');
}

function receiveStore(props, moduleId, key, value, changedrows, record, index) {
	props.cardTable.setValByKeyAndIndex(AREA.body, index, 'pk_rack', { value: null, display: null });
	props.form.setFormStatus(AREA.head, 'edit');
	props.cardTable.setStatus(AREA.body, 'edit');
}

function astUnit(props, moduleId, key, value, changedrows, record, index) {
	postEvent(props, moduleId, key, value, changedrows, record, index);
}

function cProject(props, moduleId, key, value, changedrows, record, index) {
	props.cardTable.setValByKeyAndIndex(AREA.body, index, 'cprojecttaskid', { value: null, display: null });
	props.form.setFormStatus(AREA.head, 'edit');
	props.cardTable.setStatus(AREA.body, 'edit');
}
/**
 * 后台处理的编辑事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} record 
 * @param {*} index 
 */
function postEvent(props, moduleId, key, value, changedrows, record, index) {
	let event = props.createBodyAfterEventData(PAGECODE.card, AREA.form, AREA.body, moduleId, key, changedrows);
	// 过滤空行
	// event.card.body[AREA.body].rows = event.card.body[AREA.body].rows.filter((item) => {
	// 	return item.values.pk_org != undefined;
	// });
	let rows = [ record ];
	event.card.body[AREA.body].rows = rows;
	ajax({
		method: 'POST',
		url: URL.afterBodyEdit,
		data: event,
		async: false,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg, //参数一：返回的公式对象
					{
						//参数二：界面使用的表格类型
						card_body: 'cardTable'
					}
				);
			}
			processBillCardBodyEditResult(props, moduleId, res.data, index);
			// if (res && res.data && res.data.body) {
			// 	let data = [ { index: index, data: res.data.body[AREA.body].rows[0] } ];
			// 	props.cardTable.updateDataByIndexs(AREA.body, data, false);
			// }
			if (res && res.data && res.data.billCard && res.data.billCard.head) {
				props.form.setAllFormValue({ [AREA.head]: res.data.billCard.head[AREA.head] }, false);
			}
		}
	});
}
