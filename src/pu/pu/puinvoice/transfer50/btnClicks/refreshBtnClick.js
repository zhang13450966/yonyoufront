import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { AREA, COMMON } from '../../constance';
import searchBtnClick from './searchBtnClick';

/*
 * @Author: jiangfw 
 * @PageInfo: 刷新按钮
 * @Date: 2018-08-24 11:22:54 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 15:31:23
 */
export default function clickRefreshBtn() {
	if (this.isRefAddLine) {
		searchBtnClick.call(this, null, true); // 调用查询方法
	} else {
		searchBtnClick.call(this, getDefData(COMMON.TransferCacheKey, AREA.ref50_query), true); // 调用查询方法
	}
}
