/*
 * @Author: hujieh 
 * @PageInfo: 物料编辑后事件功能(单据处理辅助属性相关)--物料在表头
 * @Date: 2018-08-14 19:10:07 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2021-10-12 15:45:03
 */
import { ajax } from 'nc-lightapp-front';

/**
 * 物料辅助属性编辑前处理，如果是参照类型，添加过滤控制
 * @param {*} item 对应的 字段
 * @param {*} appcode 小应用编码，可以为空
 * @param {*} pagecode 页面编码
 * @param {*} areacode 辅助属性所在的区域编码
 * @param {*} pk_org 主组织的值，如果需要组织过滤再添加
 */
function resetItem(props, item, appcode, pagecode, areacode, pk_org_field, freefield) {
	let key = item.attrcode;
	if (item.itemtype == 'refer') {
		item.queryCondition = (params) => {
			let record = props.form.getAllFormValue(areacode);
			let queryCondition = {};
			queryCondition.pk_org = props.form.getFormItemsValue(areacode, pk_org_field).value;
			// queryCondition = {
			// 	...(typeof queryCondition === 'function'
			// 		? queryCondition(params)
			// 		: typeof queryCondition === 'object' ? queryCondition : {})
			// };
			let reftype_key = 'TreeRefActionExt';
			if (params.refType == 'grid' || params.refType == 'gridTree') {
				reftype_key = 'GridRefActionExt';
			}
			queryCondition.appcode = appcode;
			queryCondition.pagecode = pagecode;
			queryCondition.areacode = areacode;
			queryCondition.data = JSON.stringify({ [areacode]: { areacode, rows: record.rows } });
			queryCondition.defineField = key;
			queryCondition.freefield = JSON.stringify(freefield);
			queryCondition[reftype_key] = 'nccloud.web.scmpub.pub.marasst.MarAsstDefaultRef';
			queryCondition['UsualGridRefActionExt'] = 'nccloud.web.scmpub.pub.marasst.MarAsstDefaultRef';
			return queryCondition;
		};
	}
}

/**
 * 物料辅助属性编辑后处理，如果受控字段的值不在值域内，则清空
 * @param {*} props 
 * @param {*} appcode 
 * @param {*} pagecode 
 * @param {*} areacode 
 * @param {*} key 
 * @param {*} material_field 
 * @param {*} record 
 * @param {*} index 
 */
function afterEdit(props, appcode, pagecode, areacode, key, material_field, freefield) {
	const { getAllFormValue, setFormItemsValue } = props.form;
	let record = getAllFormValue(areacode).rows[0];
	let data = {
		appcode,
		pagecode: pagecode,
		areacode,
		controlField: key,
		controlValue: (record.values[key] || {}).value,
		materialvid: (record.values[material_field] || {}).value,
		freefield: JSON.stringify(freefield)
	};
	let freefieldArr = [];
	if (freefield && Object.keys(freefield) && Object.keys(freefield).length > 0) {
		Object.keys(freefield).forEach((item) => {
			freefieldArr.push(freefield[item]);
		});
	}
	ajax({
		url: '/nccloud/scmpub/pub/marasstAfterEdit.do',
		data: data,
		mode: 'normal',
		success: (res) => {
			if (res.data && res.data.data) {
				if (res.data.data) {
					for (let i in res.data.data) {
						let values = res.data.data[i];
						if (!values || values.length == 0) {
							setFormItemsValue(areacode, {
								[i]: {
									value: null,
									display: null,
									scale: -1
								}
							});
						} else if (
							values &&
							values.length == 1 &&
							values[0] &&
							freefieldArr.length > 0 &&
							freefieldArr.includes(key) &&
							freefieldArr.includes(i)
						) {
							let newvalues = values[0].split('@-@');
							setFormItemsValue(areacode, {
								[i]: {
									value: newvalues[0],
									display: newvalues[1],
									scale: -1
								}
							});
						} else {
							let value = (record.values[i] || {}).value;
							if (!values.includes(value)) {
								setFormItemsValue(areacode, {
									[i]: {
										value: null,
										display: null,
										scale: -1
									}
								});
							}
						}
					}
				}
			}
		}
	});
}

export default { resetItem, afterEdit };
