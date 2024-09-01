/*
 * @Author: CongKe
 * @PageInfo: 远程校验
 * @Date: 2018-04-25 20:46:23
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-27 09:18:33
 */
import { ajax } from 'nc-lightapp-front';

export default function remoteSagasCheck(url, data, callBack) {
	ajax({
		url: url,
		data: data,
		method: 'post',
		success: res => {
			if (res && res.success) {
				callBack && callBack();
			}
		},
	});
}
