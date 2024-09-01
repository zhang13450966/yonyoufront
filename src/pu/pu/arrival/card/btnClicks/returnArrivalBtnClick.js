/*
 * @Author: zhangshqb 
 * @PageInfo: 原到货单退货
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA, PAGECODE, ALLBUTTONS, EDITBUTTONS } from '../../constance';
import buttonController from '../viewControl/buttonController';
export default function() {
	let _this = this;
	let id = _this.props.getUrlParam('id');
	_this.props.setUrlParam({ status: 'returnArrival' });
	let data = { id: _this.props.getUrlParam('id'), pageid: PAGECODE.card };
	let url = URL.return23;
	ajax({
		url: url,
		data: data,
		success: (res) => {
			if (res && res.data && res.data.head) {
				let vbillcode = res.data.head[_this.formId].rows[0].values.vbillcode.value;
				_this.props.form.setAllFormValue({ [_this.formId]: res.data.head[_this.formId] });
				let billstatus = _this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
				_this.setState({ billstatus: billstatus });
				// _this.toggleShow(billstatus);
				_this.setState({ vbillcode: vbillcode });
				_this.props.BillHeadInfo.setBillHeadInfoVisible({
					billCode: vbillcode
				});
			}
			if (res && res.data && res.data.body) {
				_this.props.cardTable.setTableData(_this.tableId, res.data.body[_this.tableId]);
				// let billstatus = _this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
				// _this.toggleShow(billstatus);
				// setTimeout(() => {
				// 	RownoUtils.resetRowNo(_this.props, _this.tableId, 'crowno');
				// }, 0);
			}
			buttonController.call(this);
			if (
				_this.props.getUrlParam('status') == 'return23' ||
				_this.props.getUrlParam('status') == 'returnArrival'
			) {
				_this.props.form.setFormStatus(AREA.head, 'edit');
				_this.props.cardTable.setStatus(AREA.body, 'edit');
				// setTimeout(() => {
				// 	RownoUtils.resetRowNo(this.props, this.tableId, 'crowno');
				// }, 10);
				_this.props.button.setButtonVisible(ALLBUTTONS, false);
				_this.props.button.setButtonVisible(EDITBUTTONS, true);
				_this.props.button.setButtonVisible(EDITBUTTONS, true);
				_this.props.button.setButtonVisible(
					[
						'PaseToThis', //粘贴至此
						'PastToLast', //粘贴至末行
						'CancelPast' //取消(复制)
					],
					false
				);
				_this.props.button.setButtonDisabled([ 'ResetRowno' ], false);
				_this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
				_this.props.button.setButtonVisible('Return', false);
				// _this.setState({ isShowBack: false });

				// this.props.form.setFormItemsDisabled(AREA.form,{''})
			}
		}
	});
}
