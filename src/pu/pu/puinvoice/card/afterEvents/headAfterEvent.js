/*
 * @Author: jiangfw
 * @PageInfo: 采购发票编辑后事件-表头  
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-11-08 15:09:46
 */
import { ajax } from 'nc-lightapp-front';
import { COMMON, URL, FIELD, AREA } from '../../constance';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { cacheData } from '../utils/cacheData';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

export default function afterEvent(moduleId, key, value, changedrows, i, areaIds) {
	let bodyArea = areaIds.bodyArea;
	let headArea = areaIds.headArea;
	let pageId = COMMON.cardPageId;

	if (changedrows && value && value.value == changedrows.value) {
		return;
	}

	let editFieldsHasBody = [
		FIELD.pk_org_v,
		FIELD.dbilldate,
		FIELD.darrivedate,
		FIELD.corigcurrencyid,
		FIELD.nexchangerate,
		FIELD.ctrantypeid,
		FIELD.pk_purchaseorg_v,
		FIELD.crececountryid,
		FIELD.csendcountryid,
		FIELD.ctaxcountryid,
		FIELD.pk_stockorg_v,
		FIELD.ntaxrateh,
		FIELD.ftaxtypeflagh,
		FIELD.ngroupexchgrate,
		FIELD.nglobalexchgrate,
		FIELD.pk_paytosupplier_v,
		FIELD.pk_paytosupplier,
		FIELD.pk_supplier,
		FIELD.pk_supplier_v
	];
	let editFieldsNoBody = [ FIELD.pk_bizpsn ];

	if (editFieldsHasBody.includes(key)) {
		//带表体
		// let data = this.props.createHeadAfterEventData(pageId, headArea, bodyArea, moduleId, key, value);
		// 表头编辑后上行流量
		let data = createHeadAfterEventData(this.props, pageId, headArea, bodyArea, moduleId, key, value);
		if (value !== null && value.value !== null && value.value !== '') {
			ajax({
				url: URL.afterEditHead,
				data: data,
				mode: 'normal',
				// async: true,
				async: false,
				success: (res) => {
					let data = res;
					// if (
					// 	data &&
					// 	data.data &&
					// 	data.data.billCard &&
					// 	data.data.billCard.head &&
					// 	data.data.billCard.head[headArea]
					// ) {
					// 	let headvo = data.data.billCard.head[headArea];
					// 	setTimeout(() => {
					// 		if (key == FIELD.pk_org_v) {
					// 			// 交易类型添加逻辑,设置默认值
					// 			transtypeUtils.setValue.call(this, moduleId, FIELD.ctrantypeid, FIELD.vtrantypecode);
					// 		}
					// 		this.props.form.setAllFormValue({ [headArea]: headvo });
					// 	}, 0);
					// }
					// if (
					// 	data &&
					// 	data.data &&
					// 	data.data.billCard &&
					// 	data.data.billCard.body &&
					// 	data.data.billCard.body[bodyArea] &&
					// 	data.data.billCard.body[bodyArea].rows
					// ) {
					// 	let bodyrows = data.data.billCard.body[bodyArea];
					// 	setTimeout(() => {
					// 		this.props.cardTable.setTableData(bodyArea, bodyrows);
					// 	}, 0);
					// }
					processBillCardHeadEditResult(this.props, AREA.card_head, AREA.card_body, data.data);
					if (key == FIELD.pk_org_v) {
						// 交易类型添加逻辑,设置默认值
						transtypeUtils.setValue.call(this, moduleId, FIELD.ctrantypeid, FIELD.vtrantypecode);
					}
					cacheData.call(this, AREA.card_head);
				}
			});
		}
	} else if (editFieldsNoBody.includes(key)) {
		//不带表体
		// let data = this.props.createHeadAfterEventData(pageId, headArea, bodyArea, moduleId, key, value);
		// 表头编辑后上行流量
		let data = createHeadAfterEventData(this.props, pageId, headArea, bodyArea, moduleId, key, value);
		data.card.body.card_body.rows = [];
		if (value !== null && value.value !== null && value.value !== '') {
			ajax({
				url: URL.afterEditHead,
				data: data,
				mode: 'normal',
				// async: true,
				async: false,
				success: (res) => {
					let data = res;
					// if (
					// 	data &&
					// 	data.data &&
					// 	data.data.billCard &&
					// 	data.data.billCard.head &&
					// 	data.data.billCard.head[headArea]
					// ) {
					// 	let headvo = data.data.billCard.head[headArea];
					// 	setTimeout(() => {
					// 		this.props.form.setAllFormValue({ [headArea]: headvo });
					// 	}, 0);
					// }
					processBillCardHeadEditResult(this.props, AREA.card_head, AREA.card_body, data.data);
					cacheData.call(this, AREA.card_head);
				}
			});
		}
	} else if (key == FIELD.cratetype) {
		//带表体
		// let data = this.props.createHeadAfterEventData(pageId, headArea, bodyArea, moduleId, key, value);
		// 表头编辑后上行流量
		let data = createHeadAfterEventData(this.props, pageId, headArea, bodyArea, moduleId, key, value);
		ajax({
			url: URL.afterEditHead,
			data: data,
			mode: 'normal',
			// async: true,
			async: false,
			success: (res) => {
				let data = res;
				processBillCardHeadEditResult(this.props, AREA.card_head, AREA.card_body, data.data);
				if (key == FIELD.pk_org_v) {
					// 交易类型添加逻辑,设置默认值
					transtypeUtils.setValue.call(this, moduleId, FIELD.ctrantypeid, FIELD.vtrantypecode);
				}
				cacheData.call(this, AREA.card_head);
			}
		});
	} else {
		cacheData.call(this, AREA.card_head);
	}
}
