/*
 * @Author: CongKe 
 * @PageInfo: 数据权限检查 
 * @Date: 2018-08-01 19:51:18 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-22 17:23:24
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

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
		let checkeddatas = this.props.table.getCheckedRows(PAGECODE.listcode);
		if (checkeddatas == null || checkeddatas.length == 0) {
			toast({ color: 'warning', content: getLangByResId(this, '4004ORDERREVISE-000017') }); /* 国际化处理： 请选择单据！*/
			return;
		}
		id = checkeddatas[0].data.values.pk_order.value;
	}
	let pks = new Array();
	pks.push(id);
	let data = {
		pks: pks,
		actionCode: oprcode
	};
	ajax({
		url: URL.revisedatapermission,
		data: data,
		method: 'post',
		success: (res) => {
			if (res && res.success) {
				callBack && callBack();
			}
		}
	});
}
