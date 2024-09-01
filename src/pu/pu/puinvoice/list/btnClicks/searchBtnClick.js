/*
 * @Author: jiangfw 
 * @PageInfo: 列表查询  
 * @Date: 2018-04-24 16:36:02 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-11-08 15:01:20
 */
import commonSerach from './commonSearch';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { COMMON, AREA } from '../../constance/index';
export default function clickSerachBtn() {
	let currentTab = getDefData(COMMON.PuinvoiceCacheKey, COMMON.CurrentTab);
	if (!currentTab) {
		currentTab = AREA.toCommit;
		setDefData(COMMON.PuinvoiceCacheKey, COMMON.CurrentTab, AREA.toCommit);
	}
	let queryInfo = this.props.search.getQueryInfo(this.queryArea); //必输项为空时，返回值为false
	if (queryInfo && !queryInfo.querycondition) return;
	// 将查询条件缓存
	setDefData(COMMON.PuinvoiceCacheKey, this.queryArea, queryInfo);
	// 查询
	commonSerach.bind(this, currentTab, queryInfo)();
}
