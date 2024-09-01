/*
 * @Author: jiangfw 
 * @PageInfo: 复制
 * @Date: 2018-06-02 16:14:29 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-10-13 11:30:43
 */
import { URL, UISTATE, AREA, FIELD, INVC_UI_STATE } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import btnController from '../viewControl/btnController';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import loadData from '../init/loadData';

export default function copyUtil() {
	let props = this.props;
	let data = { pks: [ this.props.getUrlParam('id') ], pagecode: this.pageId };

	ajax({
		url: URL.copyReq,
		data: data,
		success: (res) => {
			if (res.data.head && res.data.body) {
				this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
				this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
				this.setBillHeadInfo();

				// 复制 清除部分字段
				//自定义交易类型赋值
				if (this.transType) {
					transtypeUtils.setValue.call(this, AREA.card_head, FIELD.ctrantypeid, FIELD.vtrantypecode);
				} else {
					this.props.form.setFormItemsValue(this.formId, { [FIELD.ctrantypeid]: { value: null } }); //交易类型
					this.props.form.setFormItemsValue(this.formId, { [FIELD.vtrantypecode]: { value: null } }); //交易类型
				}
				// 正常发票界面复制费用发票的时候，清空费用相关信息
				let invoiceUIstate = this.state.invoiceUIstate;
				if (invoiceUIstate != INVC_UI_STATE.fee_invc) {
					props.form.setFormItemsValue(this.formId, { [FIELD.bfee]: { value: false } }); //费用发票
					props.form.setFormItemsValue(this.formId, { [FIELD.pk_parentinvoice]: { value: null } }); //费用发票对应货物发票
				}
			}

			props.form.setFormItemsDisabled(this.formId, { [FIELD.pk_org_v]: true });
			// 放开其他字段编辑性
			props.cardTable.setStatus([ AREA.card_body ], UISTATE.edit);
			btnController.call(this, UISTATE.edit, true);
		},
		error: (res) => {
			showErrorInfo(res.message);
			let pk_invoice = this.props.getUrlParam(FIELD.id);
			if (pk_invoice) {
				this.props.setUrlParam({ status: UISTATE.browse, id: pk_invoice });
				this.props.delUrlParam('copy');
				loadData.call(this);
			} else {
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				props.form.setFormStatus(AREA.card_head, UISTATE.browse);
				props.cardTable.setStatus(AREA.card_body, UISTATE.browse);
				changeUrlParam(props, {
					status: UISTATE.browse,
					id: null
				});
				btnController.call(this, UISTATE.browse, true);
			}
		}
	});

	// props.form.setFormItemsDisabled(this.formId, { [FIELD.pk_org_v]: true });
	// // 放开其他字段编辑性
	// props.cardTable.setStatus([ AREA.card_body ], UISTATE.edit);
	// btnController.call(this, UISTATE.edit, true);
}
