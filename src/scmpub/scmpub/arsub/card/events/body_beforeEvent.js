/*
 * @Author: 刘奇 
 * @PageInfo: 表体编辑前事件
 * @Date: 2019-05-30 13:43:37 
 * @Last Modified by: sunxxf
 * @Last Modified time: 2020-12-24 10:37:40
 */

import { ARSUB_CONST, ArsubHeadItem, ArsubBodyItem } from '../../const';

//props, moduleId(区域id), key(操作的键), value（当前值）,  index（当前index）, record（行数据）
export default function bodyBeforeEvent(props, moduleId, key, value, index, rowdata) {
	let csaleorgid = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.csaleorgid).value;
	let record = rowdata.values;
	let meta = props.meta.getMeta();

	// 参照只根据费用承担组织过滤的字段
	const cpayorgid_filter_Fields = [
		ArsubBodyItem.cpaydeptid,
		ArsubBodyItem.cincomeprejectid,
		ArsubBodyItem.cprojectid
	];
	// 参照只根据利润中心过滤的字段
	const cprofitcenterid_filter_Fields = [ ArsubBodyItem.ccostcenterid, ArsubBodyItem.cfactorid ];
	if (cpayorgid_filter_Fields.includes(key)) {
		props.cardTable.setQueryCondition(ARSUB_CONST.tableId, {
			[key]: () => {
				return {
					pk_org: record.cpayorgid.value
				};
			}
		});
		if (key == ArsubBodyItem.cincomeprejectid) {
			if (!record.cpayorgid.value) {
				return false;
			}
		}
	} else if (cprofitcenterid_filter_Fields.includes(key)) {
		let pk = key == ArsubBodyItem.cfactorid ? 'pk_profitcenter' : 'pk_org';

		props.cardTable.setQueryCondition(ARSUB_CONST.tableId, {
			[key]: () => {
				return {
					[pk]: record.cprofitcenterid.value
				};
			}
		});
		if (key == ArsubBodyItem.ccostcenterid) {
			if (!record.cprofitcenterid.value) {
				return false;
			}
		}
	} else if (key == ArsubBodyItem.norigarsubmny) {
		let vsrctype = (record[ArsubBodyItem.vsrctype] || {}).value;
		if (vsrctype == '4621') {
			return false;
		}
	} else if (key == ArsubBodyItem.cordertrantypeid) {
		// 适配侧拉
		props.cardTable.setQueryCondition(ARSUB_CONST.tableId, {
			[key]: () => {
				return {
					parentbilltype: '30'
				};
			}
		});
	} else if (key.startsWith('vbdef')) {
		// 表体自定义项，根据财务过滤
		let pk_org = record.pk_org;
		let flag = true;
		if (pk_org && pk_org.value) {
			if (pk_org.value != null && pk_org.value != '') {
				flag = false;
			}
		}
		meta[moduleId].items.find((item) => item.attrcode == key).isShowUnit = flag;
		meta[ARSUB_CONST.side].items.find((item) => item.attrcode == key).isShowUnit = flag;
		// 适配侧拉
		props.cardTable.setQueryCondition(ARSUB_CONST.tableId, {
			[key]: () => {
				return {
					pk_org: pk_org.value || ''
				};
			}
		});
	}
	return true;
}
