/*
 * @Author: qishy 
 * @PageInfo:卡片取消发送
 * @Date: 2019-04-29 15:16:24 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-14 10:48:51
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
		url: REQUESTURL.unSend,
		data: data,
		success: (res) => {
			if (res.success && res.data) {
				batchOperateUtils.singleOp.call(this, props, res, {
					messageTitle: getLangByResId(this, '4004comarebill-000006')
				}); /* 国际化处理： 取消发送成功*/
			}
			buttonControl.call(this, props, BILLSTATUS.free);
		}
	});
}
