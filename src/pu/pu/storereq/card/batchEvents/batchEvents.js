/*
 * @Author: zhanghrh
 * @PageInfo: 表体编辑后事件 批量 
 * @Date: 2020-08-21 14:38:54 
 */

import { ajax, base } from 'nc-lightapp-front';
import { STOREREQ_CARD, ATTRCODE, ATTRCODES, BATCHITEMSNOFILTER } from '../../siconst';
import {
	createBodyAfterEventData4Batch,
	processBillCardBodyEditResult4Batch
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
export default function batchEvents(obj) {
	// console.log(obj);
	let areaCode = obj.areaCode; //区域编码
	let column = obj.column; //列信息
	let newValue = obj.newValue; //变更的行信息
	let queryValue = [];
	let changedrows = obj.changedrows; //变更的信息，仅包含newValue和OldValue
	let currentIndex = obj.currentIndex; //当前行
	let indexs = [];
	let rows = [];
	let attrcode = column.attrcode; //列code
	let queryCondition; //统一过滤的过滤条件
	let isManyCondition = null; //是否多个过滤条件
	let pasteData = obj.pasteData; //粘贴的值
	let flag = true;
	let tableId = STOREREQ_CARD.tableId;
	//自定义项、备注以及表头主组织进行过滤的场景
	if (
		attrcode.startsWith('vbdef') ||
		attrcode === 'vbmemo' ||
		attrcode === ATTRCODES.pk_apppsn ||
		attrcode === ATTRCODES.pk_appdept_v ||
		attrcode === ATTRCODES.pk_reqstordoc
	) {
		for (let i = 0; i < newValue.length; i++) {
			//如果物料没有值就不允许编辑
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
			//每个字段单独的过滤条件，可单独处理
			// queryValue[i].queryCondition = { pk_org: newValue[i].values.pk_purchaseorg.value };
		}
		let pk_org = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value;
		queryCondition = { pk_org: pk_org };
		isManyCondition = false;
		//不需要参照过滤  数量、主数量、需求日期
	} else if (attrcode === 'pk_material') {
		for (let i = 0; i < newValue.length; i++) {
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
			//每个字段单独的过滤条件，可单独处理
			// queryValue[i].queryCondition = { pk_org: newValue[i].values.pk_purchaseorg.value };
		}
		let pk_org = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value;
		queryCondition = { pk_org: pk_org };
		isManyCondition = false;
	} else if (BATCHITEMSNOFILTER.includes(attrcode)) {
		for (let i = 0; i < newValue.length; i++) {
			//如果物料没有值就不允许编辑
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			if (
				newValue[i].values.csourcetypecode &&
				newValue[i].values.csourcetypecode.value &&
				newValue[i].values.csourcetypecode.value == '1001Z91000000001U0LZ'
			) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
	} else if (attrcode === ATTRCODES.cprojectid) {
		for (let i = 0; i < newValue.length; i++) {
			//来源单据类型为  4D14 不可编辑
			// let csourcetypecode =  this.props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.csourcetypecode).value;
			// if (csourcetypecode) {
			// 	if ('4D14' === csourcetypecode) {
			// 		flag = false;
			// 	}
			// }
			//如果物料没有值就不允许编辑
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
			//每个字段单独的过滤条件，可单独处理
			// queryValue[i].queryCondition = { pk_org: newValue[i].values.pk_purchaseorg.value };
		}
		let pk_org = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value;
		queryCondition = { pk_org: pk_org };
		isManyCondition = false;
	} else {
		return;
	}
	this.props.cardTable
		.updateAfterBatchChange({
			areaCode,
			column,
			indexs,
			queryValue,
			changedrows,
			pasteData,
			queryCondition,
			isManyCondition
		})
		.then((res) => {
			let props = res.props;
			changedrows = res.changedrows;
			indexs = res.indexs;

			//执行业务的批量编辑后事件
			// afterEvent(props, areaCode, attrcode, queryValue, changerows);
			let data = createBodyAfterEventData4Batch(
				props,
				STOREREQ_CARD.cardpageid,
				STOREREQ_CARD.formId,
				STOREREQ_CARD.tableId,
				areaCode,
				attrcode,
				changedrows,
				indexs
			);
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
					processBillCardBodyEditResult4Batch(props, STOREREQ_CARD.tableId, res.data, indexs);
					this.forceUpdate();
				}
			});
		});
}
