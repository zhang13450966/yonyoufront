/*
 * @Author: qishy 
 * 业务对账单确认按钮
 * @Date: 2019-04-29 10:03:16 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-08-09 21:03:04
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { batchOperateUtils } from '../../utils';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { onSelected } from '../viewControl/rowSelectControl';
export default function unConfirmBtnClick(props, record, index, skipCodes) {
	let data = { infos: [] };
	let checkArr = [];
	if (index >= 0 && record) {
		// 操作列取消确认
		data.infos.push({
			id: record[FIELDS.pk_comparebill].value,
			ts: record[FIELDS.ts].value
		});
	} else {
		// 表头取消确认按钮
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

	skipCodes = skipCodes ? skipCodes : new Array();
	data['skipCodes'] = skipCodes;

	ajax({
		url: REQUESTURL.unConfirm,
		data: data,
		success: (res) => {
			if (res.success && res.data) {
				// 交互式异常处理
				if (res.data.isResume && res.data.isResume == true) {
					if (res.data.url) {
						res.data.url = '../../../../' + res.data.url;
					}
					showResumeModal.bind(this)(
						props,
						'ResumeMessageDlg',
						skipCodes,
						res.data,
						unConfirmBtnClick.bind(this, props, record, index, skipCodes)
					);
					return;
				} else {
					batchOperateUtils.batchOp(props, res, checkArr, record, index, {
						messageTitle: getLangByResId(this, '4004comarebill-000029')
					}); /* 国际化处理： 取消确认成功*/
					onSelected.call(this, props);
				}
			}
		}
	});
}
