/*
 * @Author: CongKe 
 * @PageInfo: 采购订单页面查询功能 
 * @Date: 2018-04-17 19:06:54 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-09-18 16:15:12
 */
import { PAGECODE, OrderCache, FIELD } from '../../constance';
import commonSerach from './commonSearch';
import { ajax, toast, cacheTools } from 'nc-lightapp-front';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
const { set } = cacheTools;

export default function searchBtnClick(props, searchVal) {
	let queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, true);
	if (queryInfo != false) {
		this.searchflag = true;
	}
	// 将查询条件缓存
	this.setState({ searchVal: queryInfo });
	let tabCode = getDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode);
	let currentTab = tabCode && tabCode.tabCode != null ? tabCode.tabCode : '0';
	if (0 == currentTab) {
		currentTab = FIELD.tocommit;
	} else if (1 == currentTab) {
		currentTab = FIELD.approving;
	} else if (2 == currentTab) {
		currentTab = FIELD.executing;
	} else if (3 == currentTab) {
		currentTab = FIELD.all;
	}
	// 查询
	set(OrderCache.Searchval, queryInfo);
	commonSerach.call(this, currentTab, queryInfo);
}
