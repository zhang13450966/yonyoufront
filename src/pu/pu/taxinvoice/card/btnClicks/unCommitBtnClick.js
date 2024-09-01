/*
 * @Author: chaiwx 
 * @PageInfo: 收回 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-06 15:00:35
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { batchOperateUtils } from '../../utils';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function unCommitBtnClick(props) {
	let data = {
		infos: [
			{
				id: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value,
				ts: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.ts).value
			}
		]
	};

	ajax({
		url: REQUESTURL.unCommit,
		data: data,
		success: (res) => {
			if (res.success && res.data) {
				batchOperateUtils.singleOp.call(this, props, res, {
					messageTitle: getLangByResId(this, '4004Taxinvoice-000005')
				}); /* 国际化处理： 收回成功*/
			}
		}
	});
}
