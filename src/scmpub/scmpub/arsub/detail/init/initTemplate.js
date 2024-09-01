/*
 * @Author: 刘奇 
 * @PageInfo: 列表初始化模板
 * @Date: 2019-03-01 14:11:02 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-15 15:51:04
 */
import { ARSUB_CONST } from '../../const';

export default function(props) {
	props.createUIDom(
		{
			pagecode: ARSUB_CONST.detailPageId //卡片页面编码
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					// meta[ARSUB_CONST.detailId].items.map((item) => {
					// 	if (item.attrcode === 'ndetailsubmny') {
					// 		let decimaldigit = this.props.decimaldigit;
					// 		item.scale = decimaldigit ? decimaldigit : 8;
					// 	}
					// });
					props.meta.setMeta(meta);
				}
			}
		}
	);
}
