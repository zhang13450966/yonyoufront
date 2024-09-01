/*
 * @Author: CongKe 
 * @PageInfo: 直运销售生成采购订单按钮事件
 * @Date: 2018-06-19 11:40:09 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 14:55:50
 */
import { TRANSFER30TO21 } from '../../constance';
import { searchBtnClick } from './index.js';

export default function(props, key, text, record, index) {
	switch (key) {
		case TRANSFER30TO21.Refresh: // 刷新
			searchBtnClick.call(this, this.props, true);
			break;
		default:
			break;
	}
}
