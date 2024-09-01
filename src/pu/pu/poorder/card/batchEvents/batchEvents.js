/*
 * @Author: raoczh 
 * @PageInfo: 采购发票卡片批量粘贴编辑事件
 * @Date: 2020-09-01 09:28:44 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-10-20 17:03:35
 */
import { ajax } from 'nc-lightapp-front';
import { FIELD, BATCHITEM, PAGECODE, URL, APPCODE, AREA } from '../../constance';
import {
	processExtBillCardBodyEditResult4Batch,
	createBodyAfterEventData4BatchMore
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
	if (attrcode == FIELD.pk_reqstordoc) {
		for (let i = 0; i < newValue.length; i++) {
			//如果需求组织没有值就不允许编辑
			if (!(newValue[i].values.pk_reqstoorg && newValue[i].values.pk_reqstoorg.value)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];

			queryValue[i].queryCondition = {
				pk_org: newValue[i].values.pk_reqstoorg.value,
				busifuncode: FIELD.STOCKORG,
				GridRefActionExt: 'nccloud.web.pu.order.ref.RequestWarehouseBodyRefFilter'
			};
		}
		isManyCondition = true;
	} else if (
		//自定义项、备注以及表头主组织进行过滤的场景
		attrcode.startsWith('vbdef') ||
		attrcode === 'vbmemo' ||
		attrcode === 'cprojectid'
	) {
		for (let i = 0; i < newValue.length; i++) {
			//如果物料没有值就不允许编辑
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
		let pk_org = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
		queryCondition = { pk_org: pk_org };
		isManyCondition = false;
	} else if (attrcode === FIELD.pk_material) {
		for (let i = 0; i < newValue.length; i++) {
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
			if (newValue[i].values.csourcetypecode && newValue[i].values.csourcetypecode.value == FIELD.PurDaily) {
				let ccontractrowid = newValue[i].values.ccontractrowid.value;
				queryValue[i].queryCondition = {
					pk_org: newValue[i].values.pk_org.value,
					ccontractrowid: ccontractrowid,
					GridRefActionExt: 'nccloud.web.pu.order.ref.MaterialBodyRefFilter'
				};
			}
		}
		isManyCondition = true;
	} else if (attrcode == FIELD.pk_reqstoorg_v) {
		for (let i = 0; i < newValue.length; i++) {
			if (newValue[i].values.csourcetypecode && newValue[i].values.csourcetypecode.value == FIELD.PrayBill) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
	} else if (attrcode == FIELD.pk_arrvstoorg_v) {
		for (let i = 0; i < newValue.length; i++) {
			if (newValue[i].values.csourcetypecode && newValue[i].values.csourcetypecode.value != FIELD.SoOrder) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
	} else if (attrcode == FIELD.pk_psfinanceorg_v) {
		//结算财务组织
		let vcoopordercode = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.vcoopordercode).value;
		if (vcoopordercode != null) {
			return;
		}
		for (let i = 0; i < newValue.length; i++) {
			if (newValue[i].values.csourcetypecode && newValue[i].values.csourcetypecode.value == FIELD.SoOrder) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
	} else if (attrcode == 'pk_flowstockorg_v') {
		// 物流组织
		for (let i = 0; i < newValue.length; i++) {
			let pk_recvstordoc = newValue[i].values.pk_recvstordoc.value;
			let pk_arrvstoorg = newValue[i].values.pk_arrvstoorg.value;
			if (pk_recvstordoc == null && pk_arrvstoorg == null) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];

			queryValue[i].queryCondition = {
				pk_recvstordoc: pk_recvstordoc,
				pk_arrvstoorg: pk_arrvstoorg,
				GridRefActionExt: 'nccloud.web.pu.order.ref.FlowstockorgBodyRefFilter'
			};
		}
		isManyCondition = true;
	} else if (attrcode == 'ctaxcodeid') {
		// 税码
		for (let i = 0; i < newValue.length; i++) {
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			let ctaxcountryid = newValue[i].values.ctaxcountryid.value;
			let fbuysellflag = newValue[i].values.fbuysellflag.value;
			if (ctaxcountryid == null || null == fbuysellflag) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];

			queryValue[i].queryCondition = {
				ctaxcountryid: ctaxcountryid,
				fbuysellflag: fbuysellflag,
				GridRefActionExt: 'nccloud.web.pu.order.ref.CtaxcodeidBodyRefFilter'
			};
		}
		isManyCondition = true;
	} else if (attrcode == 'nexchangerate') {
		//折本汇率
		for (let i = 0; i < newValue.length; i++) {
			if (!(newValue[i].values.pk_material && newValue[i].values.pk_material.value)) {
				continue;
			}
			let corigcurrencyid = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.corigcurrencyid).value; //原币
			let curr = newValue[i].values.ccurrencyid.value;
			if (corigcurrencyid == curr) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
	} else if (
		attrcode == 'pk_arrvstoorg' ||
		attrcode == 'pk_reqstoorg' ||
		attrcode == 'pk_psfinanceorg' ||
		attrcode == 'pk_apfinanceorg' ||
		attrcode == 'ccurrencyid'
	) {
		return;
	} else {
		for (let i = 0; i < newValue.length; i++) {
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
			let data = createBodyAfterEventData4BatchMore(
				props,
				PAGECODE.cardcode,
				PAGECODE.cardhead,
				[ PAGECODE.cardbody ],
				areaCode,
				attrcode,
				changedrows,
				indexs
			);
			ajax({
				url: URL.cardBodyAfterEvent,
				data: data,
				async: false,
				success: (res) => {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg, //参数一：返回的公式对象
							{
								[PAGECODE.head_payment]: 'cardTable',
								[PAGECODE.cardbody]: 'cardTable'
							}
						);
					}
					processExtBillCardBodyEditResult4Batch(props, PAGECODE.cardbody, res.data, indexs);
					this.forceUpdate();
				}
			});
		});
}
