/*
 * @Author: chaiwx 
 * @PageInfo: 收回 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-06 15:01:47
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { batchOperateUtils } from '../../utils';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { onSelected } from '../viewControl/rowSelectControl';

export default function unCommitBtnClick(props) {
	let checkArr = props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000009')); /* 国际化处理： 请选择数据*/
		return;
	}

	let data = { infos: [] };
	checkArr.map((row) => {
		data.infos.push({
			id: row.data.values[FIELDS.pk_taxinvoice].value,
			ts: row.data.values[FIELDS.ts].value
		});
	});

	ajax({
		url: REQUESTURL.unCommit,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					batchOperateUtils.batchOp(props, res, checkArr, null, null, {
						messageTitle: getLangByResId(this, '4004Taxinvoice-000005')
					}); /* 国际化处理： 收回成功*/
				}
				onSelected.call(this, props);
			}
		}
	});
}
