/*
 * @Author: CongKe 
 * @PageInfo: 数据权限检查 
 * @Date: 2018-08-01 19:51:18 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-22 13:43:55
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';

/**
* @param {*} callBack 回调
*/
export default function deleteCheck(data, callBack) {
	ajax({
		url: URL.arrivedeletecheckaction,
		data: data,
		method: 'post',
		success: (res) => {
			if (res && res.success && res.data == true) {
				callBack && callBack();
			}
		}
	});
}
