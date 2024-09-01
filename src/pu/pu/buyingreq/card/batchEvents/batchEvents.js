/*
 * @Author: zhangshqb
 * @PageInfo: 表体编辑后事件 批量 
 * @Date: 2020-08-21 14:38:54 
 */

import { ajax, base } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, ATTRCODE, ATTRCODES, BATCHITEMSNOFILTER } from '../../siconst';
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

	//自定义项、备注以及表头主组织进行过滤的场景
	if (
		attrcode.startsWith('vbdef') ||
		attrcode === 'vbmemo' ||
		attrcode == 'cprojectid' ||
		attrcode == 'pk_reqdept_v' ||
		attrcode == 'pk_reqstor'
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
		let pk_org = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value;
		queryCondition = { pk_org: pk_org };
		isManyCondition = false;
		//不需要参照过滤  数量、主数量、需求日期、建议订货日期
	} else if (attrcode === 'pk_material') {
		for (let i = 0; i < newValue.length; i++) {
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
			//每个字段单独的过滤条件，可单独处理
			// queryValue[i].queryCondition = { pk_org: newValue[i].values.pk_purchaseorg.value };
		}
		let pk_org = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value;
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
		//根据表体采购组织过滤
	} else if (ATTRCODES.pk_employee === attrcode) {
		for (let i = 0; i < newValue.length; i++) {
			//如果物料没有值就不允许编辑
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			if (!(newValue[i].values.pk_purchaseorg && newValue[i].values.pk_purchaseorg.value)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
			//每个字段单独的过滤条件，可单独处理
			queryValue[i].queryCondition = {
				pk_org: newValue[i].values.pk_purchaseorg.value,
				busifuncode: BUYINGREQ_CARD.purchaseorg
			};
		}
		isManyCondition = true;
	} else if (ATTRCODES.pk_suggestsupplier_v === attrcode || ATTRCODES.pk_suggestsupplier === attrcode) {
		//适配建议供应商复制粘贴
		for (let i = 0; i < newValue.length; i++) {
			//如果物料没有值就不允许编辑
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			if (!(newValue[i].values.pk_purchaseorg && newValue[i].values.pk_purchaseorg.value)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
			//每个字段单独的过滤条件，可单独处理
			queryValue[i].queryCondition = {
				pk_org: newValue[i].values.pk_purchaseorg.value,
				busifuncode: BUYINGREQ_CARD.purchaseorg
			};
		}
		isManyCondition = true;
	} else {
		return;
	}
	this.props.cardTable
		.updateAfterBatchChange({
			areaCode, //区域code
			column, //对应的列，可直接使用上面获取到的column对象
			indexs, //满足并需要处理的行(可能存在第一行允许编辑，第二行不允许编辑的场景，所以indexs数组中的行数并不一定与粘贴的行数相等))
			queryValue, //与indexs对应的行数据数组(包含前过滤条件)
			changedrows, //变更行的数组(仅有newValue与oldValue)
			pasteData, //粘贴的具体内容，对于参照类型的列，此字段必传，不然无法翻译
			queryCondition, //该列统一的前过滤条件，比如物料都是根据表头主组织进行过滤
			isManyCondition //是否多个过滤条件，如物料都根据表头主组织进行过滤，此参数传false，如表体的部门根据表体的某个组织过滤，此参数传true
		})
		.then((res) => {
			let props = res.props;
			changedrows = res.changedrows;
			indexs = res.indexs;

			//执行业务的批量编辑后事件
			// afterEvent(props, areaCode, attrcode, queryValue, changerows);
			let data = createBodyAfterEventData4Batch(
				props,
				BUYINGREQ_CARD.cardpageid,
				BUYINGREQ_CARD.formId,
				BUYINGREQ_CARD.tableId,
				areaCode,
				attrcode,
				changedrows,
				indexs
			);
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
					processBillCardBodyEditResult4Batch(props, BUYINGREQ_CARD.tableId, res.data, indexs);
					this.forceUpdate();
				}
			});
		});
}
