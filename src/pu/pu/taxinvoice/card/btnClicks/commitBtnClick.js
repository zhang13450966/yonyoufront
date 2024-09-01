/*
 * @Author: chaiwx 
 * @PageInfo: 提交 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-06 15:03:13
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { batchOperateUtils } from '../../utils';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function commitBtnClick(props, saveCallback, assign) {
	let _this = this;
	let data = {
		infos: [
			{
				id: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value,
				ts: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.ts).value
			}
		]
	};

	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}

	ajax({
		url: REQUESTURL.commit,
		data: data,
		success: (res) => {
			if (res.success && res.data) {
				if (
					res.data.userObj &&
					res.data.userObj.workflow &&
					(res.data.userObj.workflow == 'approveflow' || res.data.userObj.workflow == 'workflow')
				) {
					_this.setState({
						compositedata: res.data.userObj,
						compositedisplay: true
					});
				} else {
					batchOperateUtils.singleOp.call(_this, props, res, {
						messageTitle: getLangByResId(this, '4004Taxinvoice-000010')
					}); /* 国际化处理： 提交成功*/
					if (saveCallback) {
						saveCallback();
					}
				}
			}
		}
	});
}
