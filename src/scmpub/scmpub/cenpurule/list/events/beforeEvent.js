/*
 * @Author: lichao 
 * @PageInfo: 编辑前事件
 * @Date: 2019-03-14 15:04:01 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-05-10 13:57:25
 */
import { FIELD, AREACODE } from '../../constance';

export default function(props, moduleId, key, value, index, record, status) {
	if (key === FIELD.ctrantypeid) {
		let fctrltype = record.values.fctrltype.value;
		if (fctrltype === '0') {
			let meta = props.meta.getMeta();
			meta[AREACODE.listHead].items.map((item) => {
				if (item.attrcode == FIELD.ctrantypeid) {
					item.queryCondition = () => {
						return {
							parentbilltype: 'Z2'
						};
					};
				}
			});
			props.meta.setMeta(meta);
		} else {
			return false;
		}
	}
	return true;
}
