/*
 * @Author: qishy 
 * @PageInfo:业务对账单发送按钮
 * @Date: 2019-04-29 09:47:05 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-14 10:49:31
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { batchOperateUtils } from '../../utils';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { onSelected } from '../viewControl/rowSelectControl';

export default function(props, record, index) {
	let data = { infos: [] };
	let checkArr = [];
	if (index >= 0 && record) {
		// 操作列发送
		data.infos.push({
			id: record[FIELDS.pk_comparebill].value,
			ts: record[FIELDS.ts].value
		});
	} else {
		// 表头发送按钮
		checkArr = props.table.getCheckedRows(AREA.listTableId);
		if (!checkArr || checkArr.length < 1) {
			showWarningInfo(null, getLangByResId(this, '4004comarebill-000018')); /* 国际化处理： 请选择数据*/
			return;
		}

		checkArr.map((row) => {
			data.infos.push({
				id: row.data.values[FIELDS.pk_comparebill].value,
				ts: row.data.values[FIELDS.ts].value
			});
		});
	}

	ajax({
		url: REQUESTURL.send,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					batchOperateUtils.batchOp(props, res, checkArr, record, index, {
						messageTitle: getLangByResId(this, '4004comarebill-000019')
					}); /* 国际化处理： 提交成功*/
					onSelected.call(this, props);
				}
			}
		}
	});
}
