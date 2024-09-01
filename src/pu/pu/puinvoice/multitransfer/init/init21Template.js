/*
 * @Author: jiangfw 
 * @PageInfo: 初始化采购订单拉单模板
 * @Date: 2018-06-15 14:05:20 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-22 15:26:57
 */
import { PAGECODE, APPCODE } from '../../constance';
import ref21Filter from '../../refFilter/ref21Filter';

export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			appcode: APPCODE.poorder, //应用编码
			pagecode: PAGECODE.ref21_list //卡片页面编码
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					_this.templetid_21 = templedata.template.pageid;

					let meta = templedata.template;
					// 添加参照过滤
					ref21Filter.call(_this, _this.props, meta);
					_this.props.meta.addMeta(meta);
				}
			}
		}
	);
}
