/*
 * @Author: CongKe
 * @PageInfo: 费用校验发票sagas事务状态
 * @Date: 2018-04-25 20:46:23
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-12-26 18:49:11
 */
import { ajax } from 'nc-lightapp-front';

export default function remoteSagasCheck(data, callBack) {
	ajax({
		url: '/nccloud/pu/puinvoice/invoicesagascheck.do',
		data: data,
		method: 'post',
		success: res => {
			if (res && res.success) {
				callBack && callBack();
			}
		},
	});
}
