import commonSerach from './commonSearch';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { AREA, COMMON } from '../../constance/index';

/*
 * @Author: jiangfw 
 * @PageInfo: 刷新按钮
 * @Date: 2018-08-24 11:22:54 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-07-27 11:00:20
 */
export default function clickRefreshBtn() {
	let currentTab = getDefData(COMMON.PuinvoiceCacheKey, COMMON.CurrentTab);
	if (!currentTab) {
		currentTab = AREA.toCommit;
		setDefData(COMMON.PuinvoiceCacheKey, COMMON.CurrentTab, AREA.toCommit);
	}
	commonSerach.call(this, currentTab, getDefData(COMMON.PuinvoiceCacheKey, AREA.queryArea), '1'); // 调用查询方法
}
