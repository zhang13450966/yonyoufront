/*
 * @Author: liulux
 * @PageInfo: 数据组装工具类
 * @Date: 2021-09-01 17:49:44
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-06 10:39:42
 */

/**
 * 获取卡片页表头表体pk-ts关系
 * @param {*} props 
 * @param {*} params 
 * @returns 
 */
function getPkTsDataIncludeBodyInCard(props, params) {
	let headCode = params.headCode ? params.headCode : 'head'; // 表头区域编码
	let bodyCode = params.bodyCode ? params.bodyCode : 'arsub_b'; // 表体区域编码
	let hidField = params.hidField ? params.hidField : 'carsubid'; // 表头主键名称
	let bidField = params.bidField ? params.bidField : 'carsubbid'; // 表体主键名称
	let tsField = 'ts';

	// 组件子表数据
	let allRows = props.cardTable.getAllRows(bodyCode);
	let bodys = [];
	allRows.forEach((row) => {
		bodys.push({
			id: row.values[bidField].value,
			ts: row.values[tsField].value
		});
	});

	let data = {
		infos: [
			{
				id: props.form.getFormItemsValue(headCode, hidField).value,
				ts: props.form.getFormItemsValue(headCode, tsField).value,
				bodys: bodys
			}
		]
	};

	return data;
}

export { getPkTsDataIncludeBodyInCard };
