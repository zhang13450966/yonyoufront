/*
 * @Author: CongKe 
 * @PageInfo: 请购生成订单按钮事件
 * @Date: 2018-06-19 11:40:09 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 14:59:35
 */
import { TRANSFERZ2 } from '../../constance';
import { searchBtnClick } from './index.js';

export default function(props, key, text, record, index) {
	switch (key) {
		case TRANSFERZ2.Refresh: // 刷新
			searchBtnClick.call(this, this.props, true);
			break;
		default:
			break;
	}
}
