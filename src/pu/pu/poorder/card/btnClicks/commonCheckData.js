/*
 * @Author: CongKe 
 * @PageInfo: 判断数据是否可用
 * @Date: 2018-09-11 14:46:54 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-12-17 15:37:08
 */
import { ajax } from 'nc-lightapp-front';
import { URL } from '../../constance';

export default function commonCheckData(url, checkData, callBack) {
	ajax({
		url: url,
		data: checkData,
		method: 'post',
		success: (res) => {
			if (res && res.success) {
				callBack && callBack();
			}
		}
	});
}
