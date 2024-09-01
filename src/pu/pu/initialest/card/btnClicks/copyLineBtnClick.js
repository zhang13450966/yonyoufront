/*
 * @Author: zhaochyu
 * @PageInfo: 肩部复制行
 * @Date: 2018-07-13 14:25:18
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-01-13 10:41:33
 */
import { PAGECODE, BODY_FIELD, AREA } from '../../constance';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { FIELD } from '../../../report/purchaseinreportquery/constance';
export default function(props, index) {
	rowCopyPasteUtils.copyRows.call(this, props, PAGECODE.cardbody, BODY_FIELD.cardInitBtn, BODY_FIELD.cardPastBtn);
	this.setState({ flag: 1 });
	//cachedata.call(this);
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
