/*
 * @Author: wangceb
 * @PageInfo: 删除按钮点击事件
 * @Date: 2018-05-21 15:05:52
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-13 16:26:06
 */

import { POSITION_CONST, URL } from '../../../const';
import buttonController from '../../../list/viewController/buttonController';
import { ajax } from 'nc-lightapp-front';
import {
	showWarningInfo,
	showDeleteDialog,
	showSuccessInfo
} from '../../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { deleteTableData } from 'scmpub/scmpub/components/VerticalEditTable';
import { getLangByResId } from '../../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function delete_BtnClick(props, record, index) {
	let pks = [];
	let selIndex = [];
	let deleteBill = null;
	if (record) {
		let pk = record.values['pk_position'].value;
		pks.push(pk);
		selIndex.push(index);
		let ts = record.values['ts'].value;
		deleteBill = { pk: pk, ts: ts };

		doDelete.call(this, props, deleteBill, selIndex, pks);
	} else {
		let selrows = props.cardTable.getCheckedRows(POSITION_CONST.UPTABLEID);
		if (selrows.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4004PLANPOSITION-000007')); /* 国际化处理： 请选择数据！*/
			return;
		} else {
			deleteBill = [];
			index = [];
			selrows.forEach((row) => {
				deleteBill.push({ pk: row.data.values['pk_position'].value, ts: row.data.values['ts'].value });
				pks.push(row.data.values['pk_position'].value);
				selIndex.push(row.index);
			});
			showDeleteDialog({
				beSureBtnClick: () => {
					doDelete.call(this, props, deleteBill, selIndex, pks);
				}
			});
		}
	}
}

function doDelete(props, deleteBill, selIndex, pks) {
	ajax({
		url: URL.DELETE,
		data: deleteBill,
		success: (res) => {
			if (res.success) {
				deleteTableData.call(this, POSITION_CONST.UPTABLEID, POSITION_CONST.DOWNTABLEID, selIndex, pks);
			}
			showSuccessInfo(getLangByResId(this, '4004POSITION-000005')); /* 国际化处理： 删除成功*/
			// 控制按钮状态
			buttonController.call(this, props, POSITION_CONST.BROWSER_STATUS);
		}
	});
}
