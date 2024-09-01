/*
 * @Author: 刘奇 
 * @PageInfo: 卡片修改按钮点击事件
 * @Date: 2019-03-18 16:06:01 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-07-25 16:32:54
 */
import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, BUTTON } from '../../const';
import buttonController from '../viewController/buttonController';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';

export default function buttonClick(props) {
	let id = props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid).value;
	let data = {
		pks: [ id + ',' + props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.ts).value ]
	};
	ajax({
		url: PREPAIDINVOICE_CONST.editUrl,
		data: data,
		success: (res) => {
			if (res.success) {
				props.cardTable.selectAllRows(PREPAIDINVOICE_CONST.tableId, false);
				let buttonType = this.props.getUrlParam('buttonType');
				if (buttonType != null && buttonType.indexOf('ref') != -1) {
					changeUrlParam(props, {
						status: PREPAIDINVOICE_CONST.edit,
						id: id
					});
				} else {
					changeUrlParam(props, {
						status: PREPAIDINVOICE_CONST.edit,
						id: id,
						buttonType: BUTTON.edit
					});
				}
				buttonController.call(this, props);
			}
		}
	});
}
