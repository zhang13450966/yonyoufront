/*
 * @Author: wangceb
 * @PageInfo: 编辑前事件
 * @Date: 2018-06-18 15:59:05
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-03-13 09:34:35
 */
import { POSITION_CONST } from '../../const';
export default function(props, moduleId, key, value, index, record) {
	let pk_org = this.mainorgvalue.refpk;
	let meta = this.props.meta.getMeta();
	//物料编码
	meta[POSITION_CONST.DOWNTABLEID].items.map(item => {
		if (
			item.attrcode == 'pk_marbasclass' ||
			item.attrcode == 'pk_marpuclass' ||
			item.attrcode == 'pk_srcmaterial'
		) {
			item.queryCondition = () => {
				return {
					pk_org: pk_org
				};
			};
			// “显示停用”不可见
			item.isShowDisabledData = false;
			// 支持多选
			item.isMultiSelectedEnabled = true;
		}
	});

	this.props.meta.setMeta(meta);
	return true;
}
