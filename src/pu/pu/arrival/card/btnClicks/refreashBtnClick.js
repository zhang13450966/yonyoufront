/*
 * @Author: zhangshqb
 * @PageInfo: 刷新
 * @Date: 2018-04-28 10:17:14
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-21 16:16:27
 */
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, AREA, PAGECODE, FIELD } from '../../constance';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../viewControl/buttonController';
export default function() {
	let data = {
		id: this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value,
		pageid: PAGECODE.card,
		templateid: this.templateid,
	};
	let url = URL.queryCard;
	ajax({
		url: url,
		data: data,
		success: res => {
			if (res && res.data && res.data.head) {
				this.props.form.setAllFormValue({ [AREA.head]: res.data.head.head });
				let billstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
				this.setState({ billstatus: billstatus, status: 'browse' });
				changeUrlParam(this.props, { status: 'browse', id: this.props.getUrlParam('id') });
				// this.toggleShow(billstatus);
			}
			if (res && res.data && res.data.body) {
				this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
				// RownoUtils.resetRowNo(this.props, this.tableId, 'crowno');
			}
			if (this.props.getUrlParam('status') == 'return23') {
				this.props.form.setFormStatus(AREA.head, 'edit');
				this.props.cardTable.setStatus(AREA.body, 'edit');
			}
			if (this.props.getUrlParam('type')) {
				this.props.transferTable.updateTransferListValueByIndex(AREA.leftarea, res.data, this.state.index);
			}
			// showSuccessInfo(getLangByResId(this, '4004ARRIVAL-000059'));
			showRefreshInfo();
			buttonController.call(this);
			//跳转卡片弹出提示框
			showSagaErrorToasts(this.props, AREA.form, FIELD.pk_arriveorder);
		},
	});
}
