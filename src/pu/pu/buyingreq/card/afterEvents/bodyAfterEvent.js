/*
 * @Author: zhangchangqing 
 * @PageInfo: 表体编辑后事件  
 * @Date: 2018-05-03 14:38:54 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-29 09:29:33
 */

import { ajax, base } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, ATTRCODES, CLEARFIELDS, clearItems } from '../../siconst';
import { processCardTableAutoAddRow } from '../../../../../scmpub/scmpub/pub/tool/autoAddRowUtil';
import { checkFieldsUtil } from '../../../pub/utils/checkDateUtil';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { processBatchCodeValue } from '../../../pub/utils/batchCodeUtil';
import {
	createBodyAfterEventData,
	processBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	// 初始化自定义参数
	let userobject = {};
	//触发联动计算字段 数量,换算率,主本币含税单价 本币价税合计
	// let triggerPoints = [ 'nastnum', 'nnum', 'vchangerate', 'ntaxprice', 'ntaxmny' ];
	if (key == ATTRCODES.crowno) {
		//checkRowNumber.bind(this, props, moduleId, key, value, changedrows, index, ATTRCODES.crowno)();
		return;
	}
	let data = createBodyAfterEventData(
		props,
		BUYINGREQ_CARD.cardpageid,
		BUYINGREQ_CARD.formId,
		BUYINGREQ_CARD.tableId,
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
			url: BUYINGREQ_CARD.bodyAfterEditURL,
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
				//cachedata.call(this, moduleId);
			}
		});
	} else {
		//采购组织，需求日期,供应商，单位，需求仓库，项目，批次号,数量,主数量，换算率,本币价税合计,主本币含税单价,需求部门
		// if (
		// 	key === ATTRCODES.pk_purchaseorg_v ||
		// 	key === ATTRCODES.dreqdate ||
		// 	key === ATTRCODES.pk_suggestsupplier ||
		// 	key === ATTRCODES.castunitid ||
		// 	key === ATTRCODES.pk_reqstor ||
		// 	key === ATTRCODES.cprojectid ||
		// 	key === ATTRCODES.vbatchcode ||
		// 	key === ATTRCODES.nastnum ||
		// 	key === ATTRCODES.nnum ||
		// 	key === ATTRCODES.vchangerate ||
		// 	key === ATTRCODES.ntaxmny ||
		// 	key === ATTRCODES.ntaxprice||key === ATTRCODES.pk_reqdept_v
		// ) {
		if (key != ATTRCODES.vbatchcode) {
			if (changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
				return;
			}
		}
		if (key === ATTRCODES.vchangerate) {
			let pattern = /^([1-9]\d*.?\d*|0\.\d*[1-9]\d*)(\/([1-9]\d*.?\d*|0\.\d*[1-9]\d*))?$/;
			let temp = pattern.test(value);
			if (!temp) {
				showWarningInfo(null, getLangByResId(this, '4004PRAYBILL-000000')); /* 国际化处理： 输入值必须为(0,∞]或者(0,∞]/(0,∞]*/

				props.cardTable.setValByKeyAndIndex(moduleId, index, ATTRCODES.vchangerate, {
					value: null,
					display: null,
					scale: '-1'
				});
				return;
			}
			//cachedata.call(this, moduleId);
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
		let datav = createBodyAfterEventData(
			props,
			BUYINGREQ_CARD.cardpageid,
			BUYINGREQ_CARD.formId,
			BUYINGREQ_CARD.tableId,
			moduleId,
			key,
			changedrows,
			index,
			userobject
		);
		ajax({
			url: BUYINGREQ_CARD.bodyAfterEditURL,
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
					RownoUtils.setRowNo(props, BUYINGREQ_CARD.tableId, ATTRCODES.crowno);
				}
				this.forceUpdate();
				//cachedata.call(this, moduleId);
			}
		});
	}
	processCardTableAutoAddRow(props, BUYINGREQ_CARD.tableId, index, {
		isMuli: changedrows.length > 1 ? true : false
	});
}
///(([1 - 9]\d *.?\d *)|(0\.\d*[1 - 9]\d*))/
