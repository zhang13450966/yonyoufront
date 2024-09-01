/*
 * @Author: jiangfw
 * @PageInfo: 费用发票
 * @Date: 2018-04-25 20:46:23
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-02-06 09:23:26
 */
import { UISTATE, URL, FIELD, AREA } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import btnController from '../viewControl/btnController';
import remoteSagasCheck from '../../utils/remoteSagasCheck';

export default function clickFeeInvoiceBtn() {
	let props = this.props;
	let pk_invoice = props.getUrlParam('id');
	if (!pk_invoice) {
		pk_invoice = props.form.getFormItemsValue(this.formId, FIELD.pk_invoice).value;
	}
	remoteSagasCheck.call(this, { pk: pk_invoice }, () => {
		ajax({
			url: URL.feeInvoice,
			data: { id: pk_invoice },
			success: res => {
				// 填充数据
				let bill = res.data;
				if (bill.head) {
					props.form.setAllFormValue({ [AREA.card_head]: res.data.head[AREA.card_head] });
					props.cardTable.setTableData(AREA.card_body, { rows: [] });

					// 交易类型添加逻辑,设置默认值
					transtypeUtils.setValue.call(this, this.formId, FIELD.ctrantypeid, FIELD.vtrantypecode);
					// 财务组织字段不可编辑
					props.form.setFormItemsDisabled(this.formId, { [FIELD.pk_org_v]: true });
					props.resMetaAfterPkorgEdit();

					this.setBillHeadInfo('');
					changeUrlParam(props, { status: UISTATE.add });

					// 默认表体增一行
					props.cardTable.addRow(AREA.card_body);
					RownoUtils.setRowNo(props, AREA.card_body, FIELD.crowno);
					// 界面状态控制
					btnController.call(this, UISTATE.add);
				}
			},
			error: res => {
				showErrorInfo(res.message);
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				props.form.setFormStatus(AREA.card_head, UISTATE.browse);
				props.cardTable.setStatus(AREA.card_body, UISTATE.browse);
				changeUrlParam(props, {
					status: UISTATE.browse,
					id: null,
				});
				btnController.call(this, UISTATE.browse, true);
			},
		});
	});
}
