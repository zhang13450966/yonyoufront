/*
 * @Author: wangceb 
 * @PageInfo: 初始化销售订单模板
 * @Date: 2018-04-19 10:32:11 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-21 14:42:58
 */
import { buttonControl } from '../viewController/buttonController';
import { REF30_CONST } from '../const';

export default function(props) {
	props.createUIDom(
		{
			pagecode: REF30_CONST.singleTableId, //卡片页面编码
			appcode: REF30_CONST.appcode //应用主键
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.addMeta(meta, buttonControl.bind(this, props));
				}
			}
		}
	);
}
