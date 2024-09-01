/*
 * @Author: raoczh 
 * @PageInfo: 采购发票卡片批量粘贴编辑事件
 * @Date: 2020-09-01 09:28:44 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-11 11:34:20
 */
import { ajax } from 'nc-lightapp-front';
import { FIELD, BATCHITEM, PAGECODE, URL, APPCODE, AREA } from '../../constance';
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

	if (!BATCHITEM.includes(attrcode) && !attrcode.startsWith('vbdef')) {
		return;
	}

	//自定义项、备注以及表头主组织进行过滤的场景
	if (
		attrcode.startsWith('vbdef') ||
		attrcode === 'vmemob' ||
		attrcode === 'cprojectid' ||
		attrcode === FIELD.pk_stordoc
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
		let pk_org = this.props.form.getFormItemsValue(AREA.card_head, FIELD.pk_org).value;
		queryCondition = { pk_org: pk_org };
		isManyCondition = false;
	} else if (attrcode === FIELD.pk_material) {
		for (let i = 0; i < newValue.length; i++) {
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
			//每个字段单独的过滤条件，可单独处理
			// queryValue[i].queryCondition = { pk_org: newValue[i].values.pk_purchaseorg.value };
		}
		let pk_org = this.props.form.getFormItemsValue(AREA.card_head, FIELD.pk_org).value;
		queryCondition = { pk_org: pk_org };
		isManyCondition = false;
	} else if (FIELD.nastnum == attrcode) {
		for (let i = 0; i < newValue.length; i++) {
			//如果物料没有值就不允许编辑
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			// 没有辅单位不允许编辑
			if (!(newValue[i].values.castunitid && newValue[i].values.castunitid.value)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
	} else if (FIELD.nnum == attrcode) {
		for (let i = 0; i < newValue.length; i++) {
			//如果物料没有值就不允许编辑
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			// 没有辅单位不允许编辑
			if (!(newValue[i].values.cunitid && newValue[i].values.cunitid.value)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
	} else if (attrcode == FIELD.pk_apfinanceorg_v || attrcode == FIELD.pk_apliabcenter_v) {
		// 应付财务组织
		for (let i = 0; i < newValue.length; i++) {
			if (newValue[i].values.csourcetypecode && newValue[i].values.csourcetypecode.value) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
	} else {
		for (let i = 0; i < newValue.length; i++) {
			//如果物料没有值就不允许编辑
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
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
				PAGECODE.invoiceCard,
				AREA.card_head,
				AREA.card_body,
				areaCode,
				attrcode,
				changedrows,
				indexs
			);
			ajax({
				url: URL.afterEditBody,
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
					processBillCardBodyEditResult4Batch(props, AREA.card_body, res.data, indexs);
					this.forceUpdate();
				}
			});
		});
}
