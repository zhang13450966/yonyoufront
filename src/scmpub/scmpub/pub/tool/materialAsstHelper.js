/*
 * @Author: hujieh
 * @PageInfo: 物料编辑后事件功能(单据处理辅助属性相关)
 * @Date: 2018-08-14 19:10:07
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-11-09 14:45:54
 */
import { ajax, base, toast } from 'nc-lightapp-front';

/**
 * 物料辅助属性编辑前处理，如果是参照类型，添加过滤控制
 * @param {*} props
 * @param {*} appcode 小应用编码，可以为空
 * @param {*} pagecode 页面编码
 * @param {*} areacode 辅助属性所在的区域编码
 * @param {*} key 触发事件的字段编码
 * @param {*} record 行数据
 * @param {*} freefield 客户供应商辅助属性字段编码对象，对象格式为：freefield = {ccustomerid:xxxx, ccustomervid:xxxx, cvendorid:xxxx, cvendorvid:xxxx}
 */
function resetItem(props, appcode, pagecode, areacode, key, record, freefield) {
	let meta = props.meta.getMeta();
	let item = meta[areacode].items.find((item) => item.attrcode == key);
	if (item.itemtype == 'refer') {
		let queryCondition = item.queryCondition;
		if (typeof queryCondition === 'function' && !item.filterCon) {
			item.filterCon = queryCondition;
		}
		props.cardTable.setQueryCondition(areacode, {
			[key]: (params) => {
				if (typeof queryCondition === 'function') {
					queryCondition = { ...queryCondition(params) };
				} else if (typeof queryCondition === 'object') {
					queryCondition = { ...item.filterCon(params) };
				}
				if (item.filterCon && typeof item.filterCon === 'function') {
					queryCondition = { ...item.filterCon(params) };
				}
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
				queryCondition.data = JSON.stringify({ [areacode]: { areacode: areacode, rows: [ record ] } });
				queryCondition.freefield = JSON.stringify(freefield);
				queryCondition.defineField = key;
				queryCondition[reftype_key] = 'nccloud.web.scmpub.pub.marasst.MarAsstDefaultRef';
				queryCondition['UsualGridRefActionExt'] = 'nccloud.web.scmpub.pub.marasst.MarAsstDefaultRef';
				return queryCondition;
			}
		});
	}
}

/**
 * 物料辅助属性编辑前处理，如果是参照类型，添加过滤控制
 * @param {*} props
 * @param {*} appcode 小应用编码，可以为空
 * @param {*} pagecode 页面编码
 * @param {*} areacode 辅助属性所在的区域编码
 * @param {*} key 触发事件的字段编码
 * @param {*} record 行数据
 * @param {*} freefield 客户供应商辅助属性字段编码对象，对象格式为：freefield = {ccustomerid:xxxx, ccustomervid:xxxx, cvendorid:xxxx, cvendorvid:xxxx}
 */
function resetEditItem(props, appcode, pagecode, areacode, key, record, freefield) {
	let meta = props.meta.getMeta();
	let item = meta[areacode].items.find((item) => item.attrcode == key);
	if (item.itemtype == 'refer') {
		let queryCondition = item.queryCondition;
		if (typeof queryCondition === 'function' && !item.filterCon) {
			item.filterCon = queryCondition;
		}
		props.editTable.setQueryCondition(areacode, {
			[key]: (params) => {
				if (typeof queryCondition === 'function') {
					queryCondition = { ...queryCondition(params) };
				} else if (typeof queryCondition === 'object') {
					queryCondition = { ...item.filterCon(params) };
				}
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
				queryCondition.data = JSON.stringify({ [areacode]: { areacode: areacode, rows: [ record ] } });
				queryCondition.freefield = JSON.stringify(freefield);
				queryCondition.defineField = key;
				queryCondition[reftype_key] = 'nccloud.web.scmpub.pub.marasst.MarAsstDefaultRef';
				queryCondition['UsualGridRefActionExt'] = 'nccloud.web.scmpub.pub.marasst.MarAsstDefaultRef';
				return queryCondition;
			}
		});
	}
}

/**
 * 物料辅助属性编辑前处理，如果是参照类型，添加过滤控制
 * @param {*} props
 * @param {*} appcode 小应用编码，可以为空
 * @param {*} pagecode 页面编码
 * @param {*} areacode 辅助属性所在的区域编码
 * @param {*} key 触发事件的字段编码
 * @param {*} record 行数据
 * @param {*} freefield 客户供应商辅助属性字段编码对象，对象格式为：freefield = {ccustomerid:xxxx,ccustomervid:xxxx,cvendorid:xxxx,cvendorvid:xxxx}
 */
function resetGridItem(props, appcode, pagecode, areacode, key, record, freefield) {
	let meta = props.meta.getMeta();
	let item = meta[areacode].items.find((item) => item.attrcode == key);
	if (item.itemtype == 'refer') {
		let queryCondition = item.queryCondition;
		item.queryCondition = (params) => {
			queryCondition = {
				...(typeof queryCondition === 'function'
					? queryCondition(params)
					: typeof queryCondition === 'object' ? queryCondition : {})
			};
			let reftype_key = 'TreeRefActionExt';
			if (params.refType == 'grid' || params.refType == 'gridTree') {
				reftype_key = 'GridRefActionExt';
			}
			queryCondition.appcode = appcode;
			queryCondition.pagecode = pagecode;
			queryCondition.areacode = areacode;
			queryCondition.data = JSON.stringify({ [areacode]: { areacode: areacode, rows: [ record ] } });
			queryCondition.defineField = key;
			queryCondition[reftype_key] = 'nccloud.web.scmpub.pub.marasst.MarAsstDefaultRef';
			queryCondition.freefield = JSON.stringify(freefield);
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
 * @param {*} freefield 客户供应商辅助属性字段编码对象，对象格式为：freefield = {ccustomerid:xxxx,ccustomervid:xxxx,cvendorid:xxxx,cvendorvid:xxxx}
 */
function afterEdit(props, appcode, pagecode, areacode, key, material_field, record, index, freefield) {
	let data = {
		appcode,
		pagecode,
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
		async: false,
		mode: 'normal',
		success: (res) => {
			if (res.data && res.data) {
				for (let i in res.data) {
					let values = res.data[i];
					if (!values || values.length == 0) {
						props.cardTable.setValByKeyAndIndex(areacode, index, i, {
							value: null,
							display: null,
							scale: -1
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
						props.cardTable.setValByKeyAndIndex(areacode, index, i, {
							value: newvalues[0],
							display: newvalues[1],
							scale: -1
						});
					} else {
						let value = (record.values[i] || {}).value;
						if (value != null && values[0]) {
							let newvalues = values[0].split('@-@');
							if (!newvalues.includes(value)) {
								props.cardTable.setValByKeyAndIndex(areacode, index, i, {
									value: null,
									display: null,
									scale: -1
								});
								if (i == freefield.cvendorid) {
									// 供应商oid不在约束范围之内，需要清空vid
									props.cardTable.setValByKeyAndIndex(areacode, index, freefield.cvendorvid, {
										value: null,
										display: null,
										scale: -1
									});
								} else if (i == freefield.ccustomerid) {
									// 客户oid不在约束范围之内，需要清空vid
									props.cardTable.setValByKeyAndIndex(areacode, index, freefield.ccustomervid, {
										value: null,
										display: null,
										scale: -1
									});
								}
							}
						} else if (!values.includes(value)) {
							props.cardTable.setValByKeyAndIndex(areacode, index, i, {
								value: null,
								display: null,
								scale: -1
							});
						}
					}
				}
			}
		}
	});
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
 * @param {*} freefield 客户供应商辅助属性字段编码对象，对象格式为：freefield = {ccustomerid:xxxx,ccustomervid:xxxx,cvendorid:xxxx,cvendorvid:xxxx}
 */
function afterTableEdit(props, appcode, pagecode, areacode, key, material_field, value, pk_material, index, freefield) {
	let data = {
		appcode,
		pagecode,
		areacode,
		controlField: key,
		controlValue: value,
		materialvid: pk_material,
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
		async: false,
		mode: 'normal',
		success: (res) => {
			if (res.data && res.data) {
				for (let i in res.data) {
					let values = res.data[i];
					if (!values || values.length == 0) {
						props.editTable.setValByKeyAndIndex(areacode, index, i, {
							value: null,
							display: null,
							scale: -1,
							isEdit: false
						});
					} else if (
						values &&
						values.length == 1 &&
						values[0] &&
						freefieldArr.length > 0 &&
						freefieldArr.includes(key)
					) {
						let newvalues = values[0].split('@-@');
						props.editTable.setValByKeyAndIndex(areacode, index, i, {
							value: newvalues[0],
							display: newvalues[1],
							scale: -1,
							isEdit: false
						});
					} else {
						if (!values.includes(value)) {
							props.editTable.setValByKeyAndIndex(areacode, index, i, {
								value: null,
								display: null,
								scale: -1,
								isEdit: false
							});
						}
					}
				}
			}
		}
	});
}

/**
 * 主子拉平物料辅助属性编辑前处理，如果是参照类型，添加过滤控制
 * @param {*} props
 * @param {*} appcode 小应用编码，可以为空
 * @param {*} pagecode 页面编码
 * @param {*} areacode 辅助属性所在的区域编码
 * @param {*} key 触发事件的字段编码
 * @param {*} record 行数据
 * @param {*} freefield 客户供应商辅助属性字段编码对象，对象格式为：freefield = {ccustomerid:xxxx,ccustomervid:xxxx,cvendorid:xxxx,cvendorvid:xxxx}
 */
function resetViewItem(props, appcode, pagecode, areacode, key, record, freefield) {
	let meta = props.meta.getMeta();
	let item = meta[areacode].items.find((item) => item.attrcode == key);
	if (item.itemtype == 'refer') {
		let queryCondition = item.queryCondition;
		if (typeof queryCondition === 'function' && !item.filterCon) {
			item.filterCon = queryCondition;
		}
		props.cardTable.setQueryCondition(areacode, {
			[key]: (params) => {
				if (typeof queryCondition === 'function') {
					queryCondition = { ...queryCondition(params) };
				} else if (typeof queryCondition === 'object') {
					queryCondition = { ...item.filterCon(params) };
				}
				let reftype_key = 'TreeRefActionExt';
				if (params.refType == 'grid' || params.refType == 'gridTree') {
					reftype_key = 'GridRefActionExt';
				}
				queryCondition.appcode = appcode;
				queryCondition.pagecode = pagecode;
				queryCondition.areacode = areacode;
				queryCondition.data = JSON.stringify({ [areacode]: { areacode: areacode, rows: [ record ] } });
				queryCondition.freefield = JSON.stringify(freefield);
				queryCondition.defineField = key;
				queryCondition[reftype_key] = 'nccloud.web.scmpub.pub.marasst.ViewMarAsstDefaultRef';
				queryCondition['UsualGridRefActionExt'] = 'nccloud.web.scmpub.pub.marasst.ViewMarAsstDefaultRef';
				return queryCondition;
			}
		});
	}
}

export default { resetItem, afterEdit, resetGridItem, resetViewItem, afterTableEdit, resetEditItem };
