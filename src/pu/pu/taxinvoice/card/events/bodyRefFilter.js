/*
 * 参照过滤
 * @Author: guozhq 
 * @Date: 2018-06-07 12:43:33 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-25 17:56:45
 */
import { AREA, FIELDS } from '../../constance';

export default function(props, moduleId, key, value, index, record) {
	let meta = props.meta.getMeta();
	let item = meta[moduleId].items.find((item) => item.attrcode == key);

	// 主组织
	let pk_org = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_org).value;

	if (item.attrcode == FIELDS.cmaterialvid) {
		//物料
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				if (!isNull(pk_org)) {
					return {
						pk_org: pk_org,
						SCM_DISCOUNTFLAG: 'N',
						SCM_FEEFLAG: 'N',
						SCM_ISHPROITEMS: 'Y',
						GridRefActionExt: 'nccloud.web.scmpub.ref.MaterialRefFilterUtils'
					};
				} else {
					return {};
				}
			}
		});
	} else if (item.attrcode == FIELDS.cunitid || item.attrcode == FIELDS.castunitid) {
		//单位、主单位
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				let cmaterialvid = (record.values[FIELDS.cmaterialvid] || {}).value;
				if (!isNull(cmaterialvid)) {
					return {
						scm_cmaterialid: cmaterialvid,
						GridRefActionExt: 'nccloud.web.scmpub.ref.MeasdocRefFilterUtils'
					};
				} else {
					return {};
				}
			}
		});
	} else if (item.attrcode == FIELDS.cassumedeptvid || item.attrcode == FIELDS.cassumedeptid) {
		//费用承担部门(没有处理cassumeorgid为空时，是否多选)
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				let cassumeorgid = record.values[FIELDS.cassumeorgid].value;
				if (!isNull(cassumeorgid)) {
					item.isShowUnit = false;
					return { pk_org: cassumeorgid, busifuncode: 'sa' };
				} else {
					item.isShowUnit = true;
					return { busifuncode: 'sa' };
				}
			}
		});
	} else if (item.attrcode == FIELDS.creceivedeptvid || item.attrcode == FIELDS.creceivedeptid) {
		//收货部门(没有处理creceiveorgid为空时，是否多选)
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				let creceiveorgid = record.values[FIELDS.creceiveorgid].value;
				if (!isNull(creceiveorgid)) {
					item.isShowUnit = false;
					return { pk_org: creceiveorgid, busifuncode: 'sa' };
				} else {
					item.isShowUnit = true;
					return { busifuncode: 'sa' };
				}
			}
		});
	} else if (item.attrcode == FIELDS.creceiveaddrid) {
		//收货地址
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				let creceivecustid = (record.values[FIELDS.creceivecustid] || {}).value;
				le;
				if (!isNull(creceivecustid)) {
					return { pk_customer: creceivecustid };
				} else {
					return {};
				}
			}
		});
	} else if (item.attrcode == FIELDS.csendstordocid) {
		//发货仓库
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				let csendstockorgid = (record.values[FIELDS.csendstockorgid] || {}).value;
				if (!isNull(csendstockorgid)) {
					return {
						pk_org: csendstockorgid,
						SCM_ISDIRECTSTORE: 'N',
						SCM_GUBFLAG: 'N',
						GridRefActionExt: 'nccloud.web.scmpub.ref.WareHouseRefFilterUtils'
					};
				} else {
					return {};
				}
			}
		});
	} else if (item.attrcode == FIELDS.cemployeeid) {
		//收货业务员
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				let creceiveorgid = (record.values[FIELDS.creceiveorgid] || {}).value;
				if (!isNull(creceiveorgid)) {
					return {
						pk_org: creceiveorgid,
						busifuncode: 'sa'
					};
				} else {
					return { busifuncode: 'sa' };
				}
			}
		});
	} else if (item.attrcode == FIELDS.creceivecustid) {
		//收货客户
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				if (!isNull(pk_org)) {
					return {
						pk_org: pk_org
					};
				} else {
					return {};
				}
			}
		});
	} else if (item.attrcode == FIELDS.ccostcenterid || item.attrcode == FIELDS.cfactorid) {
		//成本中心、核算要素
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				let cprofitcenterid = record.values[FIELDS.cprofitcenterid].value;
				if (!isNull(cprofitcenterid)) {
					return { pk_org: cprofitcenterid };
				} else {
					return {};
				}
			}
		});
	} else if (item.attrcode == FIELDS.cdelivorgvid) {
		//物流组织版本
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				let csendstockorgid = (record.values[FIELDS.csendstockorgid] || {}).value;
				if (!isNull(csendstockorgid)) {
					return {
						// 自定义条件
						scm_csendstockorgid: csendstockorgid,
						GridRefActionExt: 'nccloud.web.me.taxinvoice.ref.TrafficOrgRefFilterUtils'
					};
				} else {
					return {};
				}
			}
		});
	} else {
		props.cardTable.setQueryCondition(moduleId, {
			[item.attrcode]: () => {
				return {
					pk_org: pk_org
				};
			}
		});
	}

	return meta;
}

//判断某属性值是否为空
function isNull(data) {
	if (data == undefined || data == null || data == '') {
		return true;
	} else {
		return false;
	}
}
