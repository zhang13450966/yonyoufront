/*
 * @Author: 刘奇 
 * @PageInfo: 卡片复制按钮点击事件
 * @Date: 2019-05-30 18:28:01 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-06-15 14:43:44
 */

import { ARSUB_CONST, ArsubHeadItem, BUTTON } from '../../const';
import buttonController from '../viewController/buttonController';
import { ajax } from 'nc-lightapp-front';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickCopyBtn(props) {
	this.cardLastId = props.getUrlParam('id') ? props.getUrlParam('id') : null;
	let srcid = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value;
	changeUrlParam(props, {
		status: ARSUB_CONST.edit,
		type: BUTTON.copy,
		srcid: srcid,
		buttonType: BUTTON.copy,
		id: null
	});
	let data = { pageid: ARSUB_CONST.cardPageId, pks: [ srcid ] };

	ajax({
		url: ARSUB_CONST.copybillUrl,
		data: data,
		success: (res) => {
			// changeUrlParam(props, { status: BUTTON.copy, id: srcid });
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg);
			}
			props.beforeUpdatePage();
			props.form.setAllFormValue({
				[ARSUB_CONST.formId]: res.data.head[ARSUB_CONST.formId]
			});
			props.cardTable.setTableData(ARSUB_CONST.tableId, res.data.body[ARSUB_CONST.tableId]);
			props.BillHeadInfo.setBillHeadInfoVisible({
				showBillCode: false
			});
			changeUrlParam(props, { status: BUTTON.copy, id: srcid });
			buttonController.call(this, props);
			props.updatePage(ARSUB_CONST.formId, ARSUB_CONST.tableId);
		},
		error: (res) => {
			changeUrlParam(props, {
				status: ARSUB_CONST.browse,
				srcid: null,
				id: srcid
			});
			showErrorInfo(res.message);
		}
	});
}
