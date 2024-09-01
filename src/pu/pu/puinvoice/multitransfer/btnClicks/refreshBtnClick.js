import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { AREA, COMMON } from '../../constance';
import search45BtnClick from './search45BtnClick';
import search21BtnClick from './search21BtnClick';
import search4TBtnClick from './search4TBtnClick';
import searchAllBtnClick from './searchAllBtnClick';

/*
 * @Author: jiangfw 
 * @PageInfo: 刷新按钮
 * @Date: 2018-08-24 11:22:54 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 15:19:27
 */
export default function clickRefreshBtn() {
	let currentHeadTab = this.curheadTableId;

	if (currentHeadTab == AREA.headAll) {
		searchAllBtnClick.call(this, getDefData(COMMON.TransferCacheKey, AREA.searchAll), true); // 调用查询方法
	} else if (currentHeadTab == AREA.head21) {
		search21BtnClick.call(this, getDefData(COMMON.TransferCacheKey, AREA.search21), true); // 调用查询方法
	} else if (currentHeadTab == AREA.head45) {
		search45BtnClick.call(this, getDefData(COMMON.TransferCacheKey, AREA.search45), true); // 调用查询方法
	} else if (currentHeadTab == AREA.head4T) {
		search4TBtnClick.call(this, getDefData(COMMON.TransferCacheKey, AREA.head4T), true); // 调用查询方法
	}
}
