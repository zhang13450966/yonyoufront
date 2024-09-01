/*
 * @Author: wangceb 
 * @PageInfo: 查询区常用工具  
 * @Date: 2018-07-22 09:40:38 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-20 21:01:32
 */

//获取查询区某个字段的值
function getSearchValByField(props, searchId, field) {
	let searchVal = props.search.getSearchValByField(searchId, field); // 获取过滤源选择的参数
	let fieldvalue = searchVal && searchVal.value && searchVal.value.firstvalue ? searchVal.value.firstvalue : ''; // 选择的参数
	if (fieldvalue.indexOf(',') != -1) {
		return null;
	} else {
		return fieldvalue;
	}
}

export { getSearchValByField };
