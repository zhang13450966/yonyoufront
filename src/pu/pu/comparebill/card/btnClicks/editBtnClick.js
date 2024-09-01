/*
 * @Author: qishy 
 * @PageInfo: 业务对账单卡片修改
 * @Date: 2019-04-29 13:24:47 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-19 10:20:24
 */
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { buttonControl } from '../viewControl/buttonControl';

export default function(props) {
	ajax({
		url: REQUESTURL.edit,
		data: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill).value,
		success: (res) => {
			if (res.success) {
				props.setUrlParam({ status: 'edit' });
				props.form.setFormItemsDisabled(AREA.cardFormId, { [FIELDS.pk_org_v]: true });
				props.cardTable.selectAllRows(AREA.cardTableId, false);
				buttonControl.call(this, props);
			}
		}
	});
}
