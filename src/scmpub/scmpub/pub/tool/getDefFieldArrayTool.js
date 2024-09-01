/*
 * @Author: wangceb 
 * @PageInfo: 销售订单工具 
 * @Date: 2018-09-07 11:29:05 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-09-07 11:32:03
 */

export function getDefFieldArray(prefix, count) {
	let fields = [];
	for (let i = 1; i <= count; i++) {
		fields.push(prefix + i);
	}
	return fields;
}
