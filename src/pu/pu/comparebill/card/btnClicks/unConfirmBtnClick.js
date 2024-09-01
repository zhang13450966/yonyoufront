/*
 * @Author: qishy 
 * @PageInfo:业务对账单取消确认
 * @Date: 2019-04-30 14:27:04 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-08-09 20:10:16
 */

import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS, BILLSTATUS } from '../../constance';
import { batchOperateUtils } from '../../utils';
import { buttonControl } from '../viewControl/buttonControl';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function unConfirmBtnClick(props, skipCodes) {
	let data = {
		infos: [
			{
				id: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill).value,
				ts: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.ts).value
			}
		]
	};

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
						unConfirmBtnClick.bind(this, props, skipCodes)
					);
					return;
				} else {
					batchOperateUtils.singleOp.call(this, props, res, {
						messageTitle: getLangByResId(this, '4004comarebill-000029')
					}); /* 国际化处理： 取消确认成功*/
					buttonControl.call(this, props, BILLSTATUS.send);
				}
			}
		},
		error: (res) => {
			showErrorInfo(null, res.message);
		}
	});
}
