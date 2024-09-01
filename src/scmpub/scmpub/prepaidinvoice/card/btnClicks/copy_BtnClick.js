/*
 * @Author: 刘奇 
 * @PageInfo: 卡片复制按钮点击事件
 * @Date: 2019-04-12 14:43:23 
 * @Last Modified by: 刘奇 
 * @Last Modified time: 2019-04-12 14:43:23 
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, BUTTON } from '../../const';
import buttonController from '../viewController/buttonController';
import { ajax } from 'nc-lightapp-front';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickCopyBtn(props) {
	this.cardLastId = props.getUrlParam('id') ? props.getUrlParam('id') : null;
	let srcid = props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid).value;
	changeUrlParam(props, {
		status: PREPAIDINVOICE_CONST.edit,
		type: BUTTON.copy,
		srcid: srcid,
		buttonType: BUTTON.copy,
		id: ''
	});
	let data = { pageid: PREPAIDINVOICE_CONST.cardPageId, pks: [ srcid ] };

	ajax({
		url: PREPAIDINVOICE_CONST.copybillUrl,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg);
			}
			props.beforeUpdatePage();
			props.form.setAllFormValue({
				[PREPAIDINVOICE_CONST.formId]: res.data.head[PREPAIDINVOICE_CONST.formId]
			});
			props.cardTable.setTableData(PREPAIDINVOICE_CONST.tableId, res.data.body[PREPAIDINVOICE_CONST.tableId]);
			props.BillHeadInfo.setBillHeadInfoVisible({
				showBillCode: false
			});
			buttonController.call(this, props);
			props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
		},
		error: (res) => {
			changeUrlParam(props, {
				status: PREPAIDINVOICE_CONST.browse,
				srcid: null,
				id: srcid
			});
			showErrorInfo(res.message);
		}
	});
}
