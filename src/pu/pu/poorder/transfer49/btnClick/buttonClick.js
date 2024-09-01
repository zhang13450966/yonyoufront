/*
 * @Author: CongKe 
 * @PageInfo: 借入生成订单按钮事件
 * @Date: 2018-06-19 11:40:09 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-04-10 10:54:46
 */
import { TRANSFER49 } from '../../constance';
import { searchBtnClick } from './index.js';

export default function(props, key, text, record, index) {
	switch (key) {
		case TRANSFER49.Refresh: // 刷新
			searchBtnClick.call(this, true);
			break;
		default:
			break;
	}
}
