/*
 * @Author: jiangfw 
 * @PageInfo: 初始化采购入库单拉单模板
 * @Date: 2018-06-25 14:39:03 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-22 15:26:58
 */
import { PAGECODE, APPCODE } from '../../constance';
import ref45Filter from '../../refFilter/ref45Filter';
export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			appcode: APPCODE.purchaseIn, //应用编码
			pagecode: PAGECODE.ref45_list //卡片页面编码
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					_this.templetid_45 = templedata.template.pageid;

					let meta = templedata.template;
					// 添加参照过滤
					ref45Filter.call(_this, _this.props, meta);
					_this.props.meta.addMeta(meta);
				}
			}
		}
	);
}
