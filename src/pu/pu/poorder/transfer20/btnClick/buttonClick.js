/*
 * @Author: CongKe 
 * @PageInfo: 请购生成订单按钮事件
 * @Date: 2018-06-19 11:40:09 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-08-12 10:51:12
 */
import { TRANSFER20, FIELD, URL } from '../../constance';
import { searchBtnClick, supplierremoteRequest } from './index.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props, key, text, record, index) {
	let _url = null;
	switch (key) {
		case TRANSFER20.Refresh: // 刷新
			searchBtnClick.call(this, null, true);
			break;
		case TRANSFER20.Quota_Allocation: // 配额分配
			_url = URL.supplierquotas;
			supplierremoteRequest.call(this, _url, getLangByResId(this, '4004POORDER-000083')); /* 国际化处理： 配额分配*/
			break;
		case TRANSFER20.Supplier: // 确认供应商
			_url = URL.defaultsupplier;
			supplierremoteRequest.call(this, _url, getLangByResId(this, '4004POORDER-000084')); /* 国际化处理： 确认供应商*/
			break;
		case TRANSFER20.ScanTransfer: //扫码拉单
			this.scanTransfer.call(this);
			break;
		default:
			break;
	}
}
