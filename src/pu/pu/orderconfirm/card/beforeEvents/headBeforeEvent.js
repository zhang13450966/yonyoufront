/*
 * @Author: jiangfw
 * @PageInfo: 对方确认表头编辑
 * @Date: 2019-04-17 11:14:09 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-04-18 15:08:34
 */
export default async function(props, moduleId, key, value) {
	// 表头字段不可编辑
	return false;
}
