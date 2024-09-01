/*
 * @Author: jiangfw 
 * @PageInfo: 深度克隆
 * @Date: 2018-09-28 15:58:52 
 * @Last Modified by: jiangfw 
 * @Last Modified time: 2018-09-28 15:58:52 
 */
export function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj === undefined ? '' : obj));
}
