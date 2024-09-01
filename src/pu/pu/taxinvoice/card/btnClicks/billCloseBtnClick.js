/*
 * @Author: chaiwx 
 * @PageInfo: 整单关闭 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-06 15:01:40
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { batchOperateUtils } from '../../utils';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function billCloseBtnClick(props) {
	let data = {
		infos: [
			{
				id: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value,
				ts: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.ts).value
			}
		]
	};

	ajax({
		url: REQUESTURL.billClose,
		data: data,
		success: (res) => {
			if (res.success && res.data) {
				batchOperateUtils.singleOp.call(this, props, res, {
					messageTitle: getLangByResId(this, '4004Taxinvoice-000001')
				}); /* 国际化处理： 关闭成功*/
			}
		}
	});
}
