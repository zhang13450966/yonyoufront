/*
 * @Author: 刘奇 
 * @PageInfo: 粘贴至末行
 * @Date: 2019-03-19 09:57:45 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-11-11 16:27:07
 */
import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, CARD_BODY_BUTTONS, PrepaidinvoiceBodyItem } from '../../const';
import { rowCopyPasteUtils, RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import buttonController from '../viewController/buttonController';
const ClearFields = [ PrepaidinvoiceBodyItem.bid, PrepaidinvoiceBodyItem.crowno ];
//复制时清空ts会导致回写运输单时空指针
export default function buttonClick(props, record, index) {
	props.beforeUpdatePage();
	// 操作列上的粘贴至此
	rowCopyPasteUtils.pasteRowsToTail.call(
		this,
		props,
		PREPAIDINVOICE_CONST.tableId,
		CARD_BODY_BUTTONS.EDIT,
		CARD_BODY_BUTTONS.PASTE,
		ClearFields
	);
	buttonController.call(this, props);
	RownoUtils.setRowNo(props, PREPAIDINVOICE_CONST.tableId);
	//粘贴需要更行表头的价税合计
	let prepaidinvo = props.createMasterChildData(
		PREPAIDINVOICE_CONST.cardPageId,
		PREPAIDINVOICE_CONST.formId,
		PREPAIDINVOICE_CONST.tableId
	);
	let selIndex = [ 0 ];
	let info = {
		rows: selIndex,
		type: '',
		bill: prepaidinvo
	};
	ajax({
		url: PREPAIDINVOICE_CONST.pastbody,
		data: info,
		success: (res) => {
			if (res.data.canDel) {
				props.form.setAllFormValue({
					[PREPAIDINVOICE_CONST.formId]: res.data.headvo[PREPAIDINVOICE_CONST.formId]
				});
			}
		}
	});
	props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
}
