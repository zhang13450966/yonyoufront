/**
 * add by huoyzh
 * @param {*} props 
 * @param {*} searchVal 
 */
import { PAGECODE, OrderCache, FIELD } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { cacheTools } from 'nc-lightapp-front';
import commonSerach from './commonSearch';
const { set } = cacheTools;
export default function searchBtnClick(props, searchVal) {
	let queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, true);
	// if (queryInfo != null && queryInfo != '') {
	// 	this.searchflag = true;
	// }
	//modify by zhaoypm @2019/01/16 原判断对象的过程不正确
	if (!queryInfo || Object.keys(queryInfo).length == 0) {
		//校验过程getQueryInfo完成了，此处直接return
		return;
	}
	this.searchflag = true;
	// 将查询条件缓存、获取单据状态，默认为待提交的
	this.setState({ searchVal: queryInfo });
	let tabCode = getDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode);
	let currentTab = tabCode && tabCode.tabCode != null ? tabCode.tabCode : '0';
	if (0 == currentTab) {
		currentTab = FIELD.tocommit;
	} else if (1 == currentTab) {
		currentTab = FIELD.approving;
	} else if (2 == currentTab) {
		currentTab = FIELD.all;
	}
	// 查询
	// set(OrderCache.Searchval, queryInfo);
	commonSerach.call(this, currentTab, queryInfo, searchVal);
}
