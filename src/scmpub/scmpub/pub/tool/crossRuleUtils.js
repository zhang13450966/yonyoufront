import { deepClone } from '../tool';
function beforeEdit(params) {
	let { props, appcode, pagecode, headarea, bodyarea, key, isHead, record, billtype } = params;
	let { pk_org_field, transtypeid_field } = params;
	let meta = props.meta.getMeta();
	let item;
	if (isHead) {
		let rows = props.cardTable.getCheckedRows(bodyarea);
		if (!rows && rows.length > 0) {
			record = rows[0];
		}
		item = meta[headarea].items.find((item) => item.attrcode == key);
	} else {
		item = meta[bodyarea].items.find((item) => item.attrcode == key);
	}

	let crossRuleParams = {};
	crossRuleParams.pk_org = (props.form.getFormItemsValue(headarea, pk_org_field) || {}).value;
	crossRuleParams.transtype = (props.form.getFormItemsValue(headarea, transtypeid_field) || {}).value;
	crossRuleParams.key = key;
	crossRuleParams.billtype = billtype;
	crossRuleParams.currarea = isHead ? headarea : bodyarea;
	crossRuleParams.appcode = appcode;
	crossRuleParams.pagecode = pagecode;
	crossRuleParams.headarea = headarea;
	crossRuleParams.bodyarea = bodyarea;
	crossRuleParams.headdata = filterData({ [headarea]: props.form.getAllFormValue(headarea) }, headarea);
	crossRuleParams.bodydata = filterData({ [bodyarea]: { rows: [ record ] } }, bodyarea);
	item._queryCondition = item._queryCondition || item.queryCondition;
	let queryCondition = isHead ? item._queryCondition : item.queryCondition;

	//如果已经添加狗规则，则不再添加
	if (queryCondition && queryCondition.crossRuleParams) {
		return;
	}
	if (isHead) {
		if (item && item.itemtype == 'refer') {
			item.queryCondition = (params) => {
				queryCondition = {
					...(typeof queryCondition === 'function'
						? queryCondition(params)
						: typeof queryCondition === 'object' ? queryCondition : {})
				};
				if (!params) {
					return queryCondition;
				}
				let reftype_key = 'TreeRefActionExt';
				if (params.refType == 'grid' || params.refType == 'gridTree') {
					reftype_key = 'GridRefActionExt';
				}
				if (
					!queryCondition[reftype_key] ||
					queryCondition[reftype_key].indexOf('nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder') < 0
				) {
					queryCondition[reftype_key] = queryCondition[reftype_key]
						? queryCondition[reftype_key] + ',nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder'
						: 'nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder';
				}
				if (
					!queryCondition['UsualGridRefActionExt'] ||
					queryCondition['UsualGridRefActionExt'].indexOf(
						'nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder'
					) < 0
				) {
					queryCondition['UsualGridRefActionExt'] = queryCondition['UsualGridRefActionExt']
						? queryCondition['UsualGridRefActionExt'] +
							',nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder'
						: 'nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder';
				}
				queryCondition.crossRuleParams = JSON.stringify(crossRuleParams);
				return queryCondition;
			};
		}
		props.meta.setMeta(meta);
	} else {
		props.cardTable.setQueryCondition(bodyarea, {
			[key]: (params) => {
				queryCondition = {
					...(typeof queryCondition === 'function'
						? queryCondition(params)
						: typeof queryCondition === 'object' ? queryCondition : {})
				};
				if (!params) {
					return queryCondition;
				}
				let reftype_key = 'TreeRefActionExt';
				if (params.refType == 'grid' || params.refType == 'gridTree') {
					reftype_key = 'GridRefActionExt';
				}
				if (
					!queryCondition[reftype_key] ||
					queryCondition[reftype_key].indexOf('nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder') < 0
				) {
					queryCondition[reftype_key] = queryCondition[reftype_key]
						? queryCondition[reftype_key] + ',nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder'
						: 'nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder';
				}
				if (
					!queryCondition['UsualGridRefActionExt'] ||
					queryCondition['UsualGridRefActionExt'].indexOf(
						'nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder'
					) < 0
				) {
					queryCondition['UsualGridRefActionExt'] = queryCondition['UsualGridRefActionExt']
						? queryCondition['UsualGridRefActionExt'] +
							',nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder'
						: 'nccloud.web.scmpub.pub.crossrule.CrossRuleSqlBuilder';
				}
				queryCondition.crossRuleParams = JSON.stringify(crossRuleParams);
				return queryCondition;
			}
		});
	}
}

function filterData(data, areacode) {
	if (data && data[areacode] && data[areacode].rows && data[areacode].rows[0]) {
		let temp = deepClone(data);
		let values = temp[areacode].rows[0].values;
		let filteredValues = {};
		let index;
		for (index in values) {
			if (values[index] && values[index].value) {
				filteredValues[index] = values[index];
			}
		}
		temp[areacode].rows = [ { values: filteredValues } ];
		return JSON.stringify(temp);
	}
}
/**
 * 单据规则控制
 */
export default { beforeEdit };
