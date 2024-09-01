import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { AREA, COMMON } from '../../constance';
import search47BtnClick from './search47BtnClick';
import search61BtnClick from './search61BtnClick';
import searchAllBtnClick from './searchAllBtnClick';

/*
 * @Author: jiangfw 
 * @PageInfo: 刷新按钮
 * @Date: 2018-08-24 11:22:54 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 15:26:17
 */
export default function clickRefreshBtn() {
	let currentHeadTab = this.curheadTableId;

	if (currentHeadTab == AREA.headAll) {
		searchAllBtnClick.call(this, getDefData(COMMON.TransferCacheKey, AREA.searchAll), true); // 调用查询方法
	} else if (currentHeadTab == AREA.head61) {
		search61BtnClick.call(this, getDefData(COMMON.TransferCacheKey, AREA.search61), true); // 调用查询方法
	} else if (currentHeadTab == AREA.head47) {
		search47BtnClick.call(this, getDefData(COMMON.TransferCacheKey, AREA.search47), true); // 调用查询方法
	}
}
