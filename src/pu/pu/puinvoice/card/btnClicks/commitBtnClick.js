/*
 * @Author: jiangfw
 * @PageInfo: 提交
 * @Date: 2018-06-13 21:16:59
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 17:00:03
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, FIELD, PAGECODE, MODAL_ID, COMMON, UISTATE } from '../../constance';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheData, changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import btnController from '../viewControl/btnController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';

export default function clickCommitBtn(skipCodes, assign) {
	let ts = this.props.form.getFormItemsValue(AREA.card_head, FIELD.ts).value;
	let id = this.props.form.getFormItemsValue(AREA.card_head, FIELD.pk_invoice).value;
	let rows = this.props.cardTable.getAllRows(AREA.card_body);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			id: row.values[FIELD.pk_invoice_b].value,
			ts: row.values[FIELD.ts].value
		});
	});

	let data = [];
	//组装主键ts
	let commitObj = {
		ts: ts,
		id: id,
		bodys: bodys
	};
	data.push(commitObj);

	skipCodes = skipCodes ? skipCodes : new Array();
	// 拼装json
	let dataInfo = {
		dataInfo: data,
		pagecode: PAGECODE.invoiceCard,
		skipCodes: skipCodes
	};

	if (assign) {
		dataInfo['assign'] = JSON.stringify(assign);
	}

	ajax({
		url: URL.commit,
		data: dataInfo,
		pageid: this.pageId,

		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}

			if (res.success && res.data) {
				if (res.data.isResume && res.data.isResume == true) {
					if (res.data.url) {
						res.data.url = '../../../../' + res.data.url;
					}
					showResumeModal.call(
						this,
						this.props,
						MODAL_ID.MessageDlg,
						skipCodes,
						res.data,
						clickCommitBtn.bind(this, skipCodes, assign),
						this.props
					);
					return;
				}

				this.props.beforeUpdatePage();
				if (res.data.head && res.data.body) {
					//提交成功,更新单据状态和ts
					let config = {
						headAreaId: AREA.card_head,
						bodyAreaId: AREA.card_body,
						bodyPKfield: FIELD.pk_invoice_b
					};
					updateDtaForCompareByPk(this.props, res.data, config);
					// this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					// this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId]);
					// this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					// 设置按钮可用性
					updateCacheData(
						this.props,
						FIELD.pk_invoice,
						res.data.head[this.formId].rows[0].values.pk_invoice.value,
						res.data,
						this.formId,
						COMMON.PuinvoiceCacheKey
					);
					/**begain 多单编辑保存提交，下一条按钮控制有问题，20181129未提交 */
					// changeUrlParam(this.props, { status: UISTATE.browse });
					let channelType = this.props.getUrlParam('channelType');
					if (channelType == 'from2507') {
						btnController.call(this, UISTATE.browse);
					} else {
						btnController.call(this, this.indexstatus[this.curindex]);
					}
					/**end 多单编辑保存提交，下一条按钮控制有问题，20181129未提交 */
					showSuccessInfo(getLangByResId(this, '4004PUINVOICE-000011')); /* 国际化处理： 提交成功！*/

					// 切换下一条
					let type = this.props.getUrlParam('type');
					if (type) {
						this.props.transferTable.setTransformFormStatus(AREA.card_left, {
							status: true,
							onChange: (current, next, currentIndex) => {
								this.indexstatus[currentIndex] = UISTATE.browse;
							}
						});
					}
				}
				this.props.updatePage(AREA.card_head, AREA.card_body);
			}
		},
		error: (res) => {
			changeUrlParam(this.props, { id: this.pk_invoice, status: UISTATE.browse });
			btnController.call(this, UISTATE.browse);
			showErrorInfo(res.message);
		}
	});
}
