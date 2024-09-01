/*
 * @Author: chaiwx 
 * @PageInfo: 修改  
 * @Date: 2018-04-11 17:50:17 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-04-15 16:23:35
 */
import { REQUESTURL, AREA, OPTIONS, FIELDS } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { buttonControl } from '../viewControl/buttonControl';

export default function(props) {
	// let option = props.getUrlParam('option');
	// ajax({
	// 	url: REQUESTURL.edit,
	// 	data: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value,
	// 	success: (res) => {
	// 		if (res.success) {
	// 			if (option == OPTIONS.copy) {
	// 				props.setUrlParam({ option: null });
	// 			}
	// 			props.setUrlParam({ status: 'edit' });

	// 			props.form.setFormItemsDisabled(AREA.cardFormId, { [FIELDS.pk_org_v]: true });
	// 			props.cardTable.selectAllRows(AREA.cardTableId, false);
	// 			buttonControl.call(this, props);
	// 		}
	// 	}
	// });
	props.setUrlParam({ status: 'edit' });

	props.form.setFormItemsDisabled(AREA.cardFormId, { [FIELDS.pk_org_v]: true });
	props.cardTable.selectAllRows(AREA.cardTableId, false);
	buttonControl.call(this, props);
}
