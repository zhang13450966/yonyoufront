/*
 * @Author: jiangfw 
 * @PageInfo: 初始化期初暂估单拉单界面 
 * @Date: 2018-06-25 14:39:36 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-22 15:26:42
 */
import { PAGECODE, APPCODE } from '../../constance';
import ref4TFilter from '../../refFilter/ref4TFilter';

export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			appcode: APPCODE.initialest, //应用编码
			pagecode: PAGECODE.ref4T_list //卡片页面编码
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					_this.templetid_4T = templedata.template.pageid;

					let meta = templedata.template;
					// 添加参照过滤
					ref4TFilter.call(_this, _this.props, meta);
					_this.props.meta.addMeta(meta);
				}
			}
		}
	);
}
