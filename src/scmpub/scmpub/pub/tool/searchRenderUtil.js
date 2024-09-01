/*
 * 查询区渲染完需要处理主组织等函数的联动，此函数为回调工具类
 * @Author: yangls7 
 * @Date: 2019-06-06 15:44:53 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-06-06 15:46:26
 */
/**
 * @param {*} props 
 * @param {*} searchId 查询区编码
 * @param {*} field 系统函数所在的字段编码（暂时只支持了一个字段的情况，多个字段有需要的话再支持）
 * @param {*} afterEventFunction 回调函数
 */
export function searchRenderCompleteProcess(props, searchId, field, afterEventFunction, status) {
	//暂时只处理field是字符串的情况，也就是只支持一个字段的系统公式处理
	//field是字符串，代表一个字段
	let filedValue = props.search.getSearchValByField(searchId, field);
	if (filedValue && filedValue.value && filedValue.value.firstvalue) {
		let value = filedValue.value.firstvalue;
		let values = value.split(',');
		values = values.map((item) => {
			return { refpk: item };
		});
		afterEventFunction.call(this, props, searchId, field, values, null, null, status);
	} else {
		let values = [];
		afterEventFunction.call(this, props, searchId, field, values, null, null, status);
	}
}
