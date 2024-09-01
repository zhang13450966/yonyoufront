/*
 * @Author: zhaochyu 
 * @PageInfo: 采购报表工具类
 * @Date: 2018-07-24 13:24:00 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-15 16:10:58
 */
/**
 * 获得用户在该域输入的值，转为数组
 */
export function getFieldValue2Arr(props, code) {
	let data = props.search.getSearchValByField('light_report', code);
	data = ((data && data.value && data.value.firstvalue) || '').split(',');
	let length = data.length;
	if (length > 1) {
		return {};
	}
	return data;
}
/**
 * 处理参照过滤
 * @param {*} props
 * @param {*} code 参照的对象
 * @param {*} item
 * @param {*} flag 过滤标志,参照不同过滤不同
 */
export function disposeFilter(props, code, item) {
	//根据成本域所属财务组织过滤
	item.queryCondition = () => {
		let data = getFieldValue2Arr(props, code);
		return { pk_org: data[0] };
	};
}
export function systemFormulaRenderCompleteProcess(props, searchId, field, afterEventFunction) {
	//暂时只处理field是字符串的情况，也就是只支持一个字段的系统公式处理
	//TODO 当field是数组的情况
	//field是字符串，代表一个字段
	let filedValue = props.search.getSearchValByField(searchId, field);
	if (filedValue && filedValue.value && filedValue.value.firstvalue) {
		let value = filedValue.value.firstvalue;
		let values = value.split(',');
		values = values.map((item) => {
			return { refpk: item };
		});
		afterEventFunction.call(this, props, searchId, field, values);
	} else {
		//为了保证每次切换状态都会走回调函数
		let values = { refpk: undefined };
		afterEventFunction.call(this, props, searchId, field, values);
	}
}
/**
 * 获取当月第一天，返回是Date类型
 */
export function getFirstDayOfMonth() {
	var date = new Date();
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	return firstDay;
}

export function getUrlConditions(pop) {
	if (!pop) return;
	let conditions = [];
	let queryString = window.location.search || window.location.hash;
	if (queryString.includes('?')) {
		queryString = queryString.split('?')[1];
	} else {
		queryString = queryString.substring(1);
	}
	if (queryString) {
		let params = decodeURIComponent(queryString);
		params = params.split('&');
		params = params.filter((param) => param.startsWith(pop));
		if (!params || params.length < 1) {
			return;
		}
		params = params[0];
		params = JSON.parse(params.slice(params.indexOf('=') + 1, params.length));
		for (var key in params) {
			conditions.push(JSON.parse(params[key]));
		}
	}
	return conditions;
}
