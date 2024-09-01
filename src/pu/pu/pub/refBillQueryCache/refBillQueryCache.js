/*
 * @Author: CongKe 
 * @PageInfo:来源单据查询缓存
 * @Date: 2018-10-17 11:01:16 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-17 11:13:33
 */
import { ajax } from 'nc-lightapp-front';
import { setDefData } from '../../../../scmpub/scmpub/pub/cache';

export function refBillQueryCache(refBillQueryData, dataSource, cacheKey) {
	ajax({
		url: '/nccloud/pu/pub/refbillqueryaction.do',
		data: refBillQueryData,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					setDefData(dataSource, cacheKey, res.data);
				}
			}
		}
	});
}
