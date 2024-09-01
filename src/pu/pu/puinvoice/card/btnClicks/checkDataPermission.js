/*
 * @Author: maopch 
 * @PageInfo:  特殊权限检查
 * @Date: 2018-07-31 10:53:42 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-14 23:00:22
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD } from '../../constance';
import { getHeadValue } from '../utils/cardUtil';

/**
 * @param {*} actioncode 操作code
 * @param {*} callBack 回调
 */
export default function checkDataPermission(actioncode, callBack) {
	let id = getHeadValue(this.props, FIELD.pk_invoice).value;

	let rows = new Array();
	rows.push({ id });
	ajax({
		url: URL.checkDataPermission,
		data: { dataInfo: rows, actioncode },
		method: 'post',
		success: (res) => {
			if (res && res.success) {
				callBack && callBack();
			}
		}
	});
}
