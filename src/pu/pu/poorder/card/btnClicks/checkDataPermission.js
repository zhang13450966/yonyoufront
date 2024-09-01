/*
 * @Author: CongKe 
 * @PageInfo: 数据权限检查 
 * @Date: 2018-08-01 19:51:18 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-08-02 09:52:36
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';

/**
*
* @param {*} record
* @param {*} oprcode 操作code
* @param {*} callBack 回调
*/
export default function checkDataPermission(record, oprcode, callBack) {
	let id = '';
	if (record) {
		id = record.pk_order.value;
	} else {
		let pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
		id = pk_order && pk_order.value;
	}
	if (id == null) {
		callBack && callBack();
	}
	let pks = new Array();
	pks.push(id);
	let data = {
		pks: pks,
		actionCode: oprcode
	};
	ajax({
		url: URL.editdatapermission,
		data: data,
		method: 'post',
		success: (res) => {
			if (res && res.success) {
				callBack && callBack();
			}
		}
	});
}
