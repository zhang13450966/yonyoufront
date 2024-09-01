/*
 * @Author: wangceb 
 * @PageInfo: 销售订单列表按钮事件处理
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-21 15:11:27
 */
import { REF4641_CONST } from '../const';
import refresh_BtnClick from './refresh_BtnClick';

export default function buttonClick(props, id) {
	switch (id) {
		// Refresh	刷新
		case REF4641_CONST.refresh:
			return refresh_BtnClick.call(this, props);
			break;
		default:
			break;
	}
}
