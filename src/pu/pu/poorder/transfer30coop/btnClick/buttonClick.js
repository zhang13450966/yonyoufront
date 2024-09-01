/*
 * @Author: CongKe 
 * @PageInfo: 协同销售生成采购订单按钮事件
 * @Date: 2018-06-19 11:40:09 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 14:55:23
 */
import { TRANSFER30TO21COOP } from '../../constance';
import { searchBtnClick } from './index.js';

export default function(props, key, text, record, index) {
	switch (key) {
		case TRANSFER30TO21COOP.Refresh: // 刷新
			searchBtnClick.call(this, this.props, true);
			break;
		default:
			break;
	}
}
