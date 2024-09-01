/*
 * @Author: qishy 
 * @PageInfo:业务对账单确认
 * @Date: 2019-04-30 14:27:04 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-14 10:48:15
 */

import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS, BILLSTATUS } from '../../constance';
import { batchOperateUtils } from '../../utils';
import { buttonControl } from '../viewControl/buttonControl';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	let data = {
		infos: [
			{
				id: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill).value,
				ts: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.ts).value
			}
		]
	};

	ajax({
		url: REQUESTURL.confirm,
		data: data,
		success: (res) => {
			if (res.success && res.data) {
				batchOperateUtils.singleOp.call(this, props, res, {
					messageTitle: getLangByResId(this, '4004comarebill-000028')
				}); /* 国际化处理： 确认成功*/
			}
			buttonControl.call(this, props, BILLSTATUS.confirm);
		}
	});
}
