/*
 * @Author: zhangchangqing 
 * @PageInfo: 表体编辑后事件  
 * @Date: 2018-05-03 14:38:54 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-29 09:26:21
 */

import { ajax, base, toast } from 'nc-lightapp-front';
//import { AREA, UISTATE, FIELD, URL } from '../../constance';
import { STOREREQ_CARD, ATTRCODES, CLEARFIELDS, clearItems } from '../../siconst';
import { checkFieldsUtil } from '../../../pub/utils/checkDateUtil';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { processCardTableAutoAddRow } from '../../../../../scmpub/scmpub/pub/tool/autoAddRowUtil';
import {
	createBodyAfterEventData,
	processBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { processBatchCodeValue } from '../../../pub/utils/batchCodeUtil';
const { NCMessage } = base;

export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	// 初始化自定义参数
	let userobject = {};
	//触发联动计算字段 数量,换算率,主本币含税单价 本币价税合计
	let triggerPoints = [ 'nastnum', 'nnum', 'vchangerate', 'ntaxprice', 'ntaxmny' ];
	if (key == ATTRCODES.crowno) {
		//checkRowNumber.bind(this, props, moduleId, key, value, changedrows, index, ATTRCODES.crowno)();
		return;
	}
	let data = createBodyAfterEventData(
		props,
		STOREREQ_CARD.cardpageid,
		STOREREQ_CARD.formId,
		STOREREQ_CARD.tableId,
		moduleId,
		key,
		changedrows,
		index,
		userobject
	);
	//物料
	if (key === ATTRCODES.pk_material) {
		//如果物料值为空，清空相应字段值
		let returnFlag = checkFieldsUtil(props, moduleId, key, value, changedrows, index, record, clearItems);
		if (!returnFlag) {
			return;
		}
		//当选择的物料是一条的时候进行判断，如果新旧值相同则不需要进行调用
		if (changedrows.length == 1) {
			if (changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
				return;
			}
		}
		ajax({
			url: STOREREQ_CARD.bodyAfterEditURL,
			data: data,
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
			}
		});
	} else if (triggerPoints.includes(key)) {
		if (changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
			return;
		}
		ajax({
			url: STOREREQ_CARD.numbAfterEditURL,
			data: data,
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
			}
		});
	} else {
		if (key != ATTRCODES.vbatchcode) {
			if (changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
				return;
			}
		}
		if (key === ATTRCODES.vchangerate) {
			let pattern = /^([1-9]\d*.?\d*|0\.\d*[1-9]\d*)(\/([1-9]\d*.?\d*|0\.\d*[1-9]\d*))?$/;
			let temp = pattern.test(value);
			if (!temp) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004STOREREQ-000000') /* 国际化处理： 输入值必须为(0,∞]或者(0,∞]/(0,∞]*/
				});
				props.cardTable.setValByKeyAndIndex(moduleId, index, ATTRCODES.vchangerate, {
					value: null,
					display: null,
					scale: '-1'
				});
				return;
			}
		} else if (key === ATTRCODES.vbatchcode) {
			userobject = processBatchCodeValue(props, moduleId, value, CLEARFIELDS);
			if (!userobject) {
				props.cardTable.setValByKeyAndIndex(moduleId, index, ATTRCODES.vbatchcode, {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, index, ATTRCODES.pk_batchcode, {
					value: null,
					display: null
				});
				return;
			}
		}
		//申请部门编辑处理，需求日期编辑处理,项目，批次号
		let datav = createBodyAfterEventData(
			props,
			STOREREQ_CARD.cardpageid,
			STOREREQ_CARD.formId,
			STOREREQ_CARD.tableId,
			moduleId,
			key,
			changedrows,
			index,
			userobject
		);

		ajax({
			url: STOREREQ_CARD.bodyAfterEditURL,
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
				if (key === ATTRCODES.vbatchcode) {
					RownoUtils.setRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
				}
				this.forceUpdate();
			},
			error: (error) => {
				if (ATTRCODES.dreqdate == key) {
					props.cardTable.setValByKeyAndIndex(moduleId, index, ATTRCODES.dreqdate, {
						value: null,
						display: null
					});
				}
				toast({
					color: 'danger',
					content: error.message
				});
			}
		});
	}
	processCardTableAutoAddRow(props, STOREREQ_CARD.tableId, index, {
		isMuli: changedrows.length > 1 ? true : false
	});
}
