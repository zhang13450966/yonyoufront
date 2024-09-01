/*
 * @Author: wangceb
 * @PageInfo: 编辑前事件
 * @Date: 2018-06-18 15:59:05
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-03-13 09:32:49
 */
import { POSITION_CONST } from '../../const';
export default function(props, moduleId, key, value, index, record) {
	let pk_org = this.mainorgvalue.refpk;
	let meta = this.props.meta.getMeta();
	//物料编码
	meta[POSITION_CONST.UPTABLEID].items.map(item => {
		// 根据采购组织过滤人员
		if (item.attrcode == 'cemployeeid') {
			item.queryCondition = () => {
				return {
					pk_org: pk_org,
					busifuncode: 'pu'
				};
			};
			// “显示停用”不可见
			item.isShowDisabledData = false;
		}
	});
	this.props.meta.setMeta(meta);
	return true;
}
