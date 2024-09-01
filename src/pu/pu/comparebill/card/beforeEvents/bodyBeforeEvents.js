/*
 * @Author: chaiwx 
 * @PageInfo: 编辑前  
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-07-03 09:31:30
 */
import bodyRefFilter from '../events/bodyRefFilter';

export default function(props, moduleId, key, value, index, record) {
	let meta = props.meta.getMeta();
	let item = meta[moduleId].items.find((item) => item.attrcode == key);

	bodyRefFilter(props, moduleId, key, value, index, record);

	return !item.disabled;
}
