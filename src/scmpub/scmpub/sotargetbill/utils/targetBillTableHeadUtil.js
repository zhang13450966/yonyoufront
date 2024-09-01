/*
 * @Author: raoczh 
 * @PageInfo: 销售指标维护表体多表头处理
 * @Date: 2020-02-13 15:50:28 
 * @Last Modified by: wangpju
 * @Last Modified time: yyyy-09-Fr 01:24:39
 */
import { TARGETBILL_CONST, FIELD } from '../const';
import { deepClone } from '../../pub/tool';
import referEvent from '../card/events/referEvent';
import { getLangByResId } from '../../pub/tool/multiLangUtil';

export default function multiDataUtil(props, data) {
	let tableId = data.tableId;
	let formId = data.formId;
	let meta = deepClone(this.meta);
	let nrealyearvalueScal = null;
	let ntargetvalueScal = null;

	if (data) {
		let bodyDownCloumsYear = data.bodyDownCloumsYear;
		let bodyDownCloumsOther = data.bodyDownCloumsOther;
		let bodyUpCloumsOther = data.bodyUpCloumsOther;
		let bodyUpCloumsYear = data.bodyUpCloumsYear;
		let headCloum = data.headCloum;
		let items = [];
		let pk_org = (props.form.getFormItemsValue(formId, FIELD.pk_org) || {}).value;
		let ctargetid = (props.form.getFormItemsValue(formId, FIELD.ctargetid) || {}).value;
		let vperiod = FIELD.vperiod;
		let cmardimenid = FIELD.cmardimenid;
		for (let headKey in headCloum) {
			let marOrPer = headCloum[headKey];
			let item_head = {};
			if (marOrPer == 0) {
				//期间
				item_head = {
					attrcode: vperiod,
					key: vperiod,
					label: getLangByResId(this, '4001TARGETBILL-000018') /* 国际化处理： 期间*/,
					itemtype: 'refer',
					fieldDisplayed: 'refname',
					refcode: 'scmpub/refer/targetPeriod/SaleTargetPeriodGridRefer/index.js',
					isMultiSelectedEnabled: false,
					visible: true
				};
			} else if (marOrPer == 1) {
				//物料
				item_head = {
					attrcode: cmardimenid,
					key: cmardimenid,
					label: getLangByResId(this, '4001TARGETBILL-000017') /* 国际化处理： 物料维度*/,
					itemtype: 'refer',
					fieldDisplayed: 'refname',
					refcode: 'scmpub/refer/SaleMarterial/SaleMarterialGridRefer/index.js',
					isMultiSelectedEnabled: false,
					visible: true
				};
			}
			if (this.ctargetvalue.values.fmarsetflag.value != '0') {
				meta[formId].items.push(item_head);
			}
			meta[tableId].items.forEach((item) => {
				item.queryCondition = () => {
					return { TARGETID: ctargetid };
				};
				if (item.attrcode == 'nrealyearvalue') {
					nrealyearvalueScal = item.scale;
				} else if (item.attrcode == 'ntargetvalue') {
					ntargetvalueScal = item.scale;
				}
			});
		}

		if (bodyUpCloumsYear) {
			//年表头
			for (let yearKey in bodyUpCloumsYear) {
				// let item_up = {
				// 	attrcode: bodyUpCloumsYear[yearKey],
				// 	label: bodyUpCloumsYear[yearKey],
				// 	visible: false
				// };
				// meta[tableId].items.push(item_up);

				let c = [];
				if (bodyDownCloumsYear) {
					for (let yKey in bodyDownCloumsYear) {
						let item_down = {
							attrcode: 'year' + 'dynamic_column' + yKey,
							label: bodyDownCloumsYear[yKey],
							itemtype: 'number',
							scale: nrealyearvalueScal,
							visible: true
						};
						c.push('year' + 'dynamic_column' + yKey);
						meta[tableId].items.push(item_down);
					}
				}

				items.push({
					name: bodyUpCloumsYear[yearKey],
					code: yearKey,
					children: c,
					visible: true
				});
			}
		}
		if (bodyUpCloumsOther) {
			//其它表头
			for (let marKey in bodyUpCloumsOther) {
				// let item_up = {
				// 	attrcode: marKey,
				// 	label: bodyUpCloumsOther[marKey],
				// 	visible: false
				// };
				// meta[tableId].items.push(item_up);

				let c = [];
				if (bodyDownCloumsOther) {
					for (let othDownKey in bodyDownCloumsOther) {
						let item_down = {
							attrcode: 'dynamic_column' + marKey + othDownKey,
							label: bodyDownCloumsOther[othDownKey],
							itemtype: 'number',
							scale: ntargetvalueScal,
							visible: true
						};
						c.push('dynamic_column' + marKey + othDownKey);
						meta[tableId].items.push(item_down);
					}
				}
				items.push({
					name: bodyUpCloumsOther[marKey],
					code: marKey,
					children: c,
					visible: true
				});
			}
		}

		//占位行调样式
		let occupy = {
			attrcode: '',
			label: '',
			itemtype: 'label',
			visible: true,
			render: () => {}
		};
		meta[tableId].items.push(occupy);

		props.meta.handleMultiple(meta, { [tableId]: items });
		props.meta.setMeta(meta);

		referEvent.call(this, this.props, meta, formId);
	}
}
