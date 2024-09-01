/*
 * @Author: zhaochyu
 * @PageInfo: 粘贴至末行
 * @Date: 2018-08-28 16:36:12
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-01-13 10:41:45
 */
import { BODY_FIELD, PAGECODE, CARD_BUTTON, AREA, FIELD } from '../../constance';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { buttonController } from '../viewControl';
export default function(props) {
	props.beforeUpdatePage();
	rowCopyPasteUtils.pasteRowsToTail.call(
		this,
		props,
		PAGECODE.cardbody,
		BODY_FIELD.cardInitBtn,
		BODY_FIELD.cardPastBtn,
		[BODY_FIELD.crowno]
	);
	RownoUtils.setRowNo(props, PAGECODE.cardbody, BODY_FIELD.crowno);
	this.setState({ flag: 0 });
	buttonController.lineSelected.call(this, this.props);
	props.updatePage(AREA.cardFormArea, AREA.cardTableArea);
}
function cachedata() {
	let transfer = this.props.getUrlParam(FIELD.cardStatus) === FIELD.transfer;
	if (transfer) {
		let curindex = parseInt(this.curindex);
		let headVals = this.props.form.getAllFormValue(PAGECODE.cardhead);
		let bodyVals = this.props.cardTable.getVisibleRows(PAGECODE.cardbody);
		let transferData = {};
		let head = { card_head: { rows: headVals.rows } };
		let body = { card_body: { rows: bodyVals } };
		transferData.head = head;
		transferData.body = body;
		this.props.transferTable.setTransferListValueByIndex(AREA.leftarea, transferData, curindex);
	}
}
