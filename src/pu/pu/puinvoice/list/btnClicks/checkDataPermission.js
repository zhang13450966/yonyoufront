/*
 * @Author: maopch 
 * @PageInfo:  数据权限检查
 * @Date: 2018-07-31 10:53:42 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-02-28 17:10:51
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

/**
 *
 * @param {*} record
 * @param {*} actioncode 操作code
 * @param {*} callBack 回调
 */
export default function(record, actioncode, callBack) {
	let id = '';
	if (record) {
		id = record.pk_invoice.value;
	} else {
		let checkeddatas = this.props.table.getCheckedRows(AREA.card_head);
		if (checkeddatas == null || checkeddatas.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000047') /* 国际化处理： 请注意,请选择单据！*/);
			return;
		}
		id = checkeddatas[0].data.values.pk_invoice.value;
	}

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
		},
		error: (res) => {
			showErrorInfo(res.message);
		}
	});
}
