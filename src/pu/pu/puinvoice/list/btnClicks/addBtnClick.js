/*
 * @Author: jiangfw 
 * @PageInfo: 新增 
 * @Date: 2018-04-24 20:02:32 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:43:41
 */
import { URL, UISTATE, COMMON, PAGECODE } from '../../constance/index';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';

export default function clickAddBtn() {
	// 清除缓存
	setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, null);
	this.props.pushTo(URL.card, {
		status: UISTATE.add,
		pagecode: PAGECODE.invoiceCard
	});
}
