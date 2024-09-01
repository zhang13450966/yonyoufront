/*
 * @Author: 刘奇 
 * @PageInfo: 卡片查询实现
 * @Date: 2019-03-05 15:16:17 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2019-12-13 10:22:59
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, BUTTON } from '../../const';
import buttonController from '../viewController/buttonController';
import { getCacheDataByPk, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorInfo, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { showSagaErrorToast } from '../../../../../scmpub/scmpub/pub/tool/sagaMessageUtils';
export default function pageInfoClick(props, hid, type) {
	setTimeout(() => {
		let billcodeStr = '';
		if (hid == undefined || !hid) {
			this.props.beforeUpdatePage();
			billcodeStr = '';
			this.props.form.EmptyAllFormValue(PREPAIDINVOICE_CONST.formId);
			this.props.cardTable.setTableData(PREPAIDINVOICE_CONST.tableId, { rows: [] });
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBillCode: false
			});
			this.props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
			buttonController.call(this, this.props);
			return;
		}

		let cacheData = getCacheDataByPk(props, PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey, hid);
		if (cacheData && type != BUTTON.refresh) {
			this.props.beforeUpdatePage();

			billcodeStr =
				cacheData.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.vbillcode].value;
			this.props.form.setAllFormValue({
				[PREPAIDINVOICE_CONST.formId]: cacheData.head[PREPAIDINVOICE_CONST.formId]
			});
			this.props.cardTable.setTableData(
				PREPAIDINVOICE_CONST.tableId,
				cacheData.body[PREPAIDINVOICE_CONST.tableId],
				null,
				true,
				true
			);

			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBillCode: true,
				billCode: billcodeStr
			});
			this.props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
			buttonController.call(this, this.props);
			// add by huoyzh 云原生适配 点击立即查看，弹出与点击小红点一样的错误弹框
			let saga_status =
				cacheData.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.saga_status];
			if (saga_status && saga_status.value == '1') {
				let params = {
					gtxid:
						cacheData.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.saga_gtxid]
							.value,
					billpk: cacheData.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.hid].value
				};
				showSagaErrorToast(props, params);
			}
			return;
		}
		let pks = [];
		pks.push(hid);
		let data = { pks: pks, pageid: PREPAIDINVOICE_CONST.cardPageId };

		ajax({
			url: PREPAIDINVOICE_CONST.queryCardUrl,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg);
				}
				this.props.beforeUpdatePage();
				if (data === undefined || res.data == null) {
					// 刷新时，若此数据被删除，则保留界面数据，而不是报错
					showErrorInfo(
						null,
						getLangByResId(this, '4006PREPAIDINVOICE-000003')
					); /* 国际化处理： 错误,数据已经被删除，请返回列表界面！*/
					if (type == BUTTON.refresh) {
						changeUrlParam(props, {
							status: PREPAIDINVOICE_CONST.browse
						});
					}
				} else if (res.data.head && res.data.body) {
					billcodeStr = res.data.head[PREPAIDINVOICE_CONST.formId].rows[0].values.vbillcode.value;
					this.props.form.setAllFormValue({
						[PREPAIDINVOICE_CONST.formId]: res.data.head[PREPAIDINVOICE_CONST.formId]
					});
					this.props.cardTable.setTableData(
						PREPAIDINVOICE_CONST.tableId,
						res.data.body[PREPAIDINVOICE_CONST.tableId],
						null,
						true,
						true
					);
					updateCacheData(
						props,
						PrepaidinvoiceHeadItem.hid,
						res.data.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.hid].value,
						res.data,
						PREPAIDINVOICE_CONST.formId,
						PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
					);
				}
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBillCode: true,
					billCode: billcodeStr
				});
				this.props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
				buttonController.call(this, this.props);
				if (type == BUTTON.refresh && data && res.data) {
					showRefreshInfo();
				}
				// add by huoyzh 云原生适配 点击立即查看，弹出与点击小红点一样的错误弹框
				let saga_status = (props.form.getFormItemsValue(
					PREPAIDINVOICE_CONST.formId,
					PrepaidinvoiceHeadItem.saga_status
				) || {}).value;
				if (saga_status && saga_status == '1') {
					let params = {
						gtxid: props.form.getFormItemsValue(
							PREPAIDINVOICE_CONST.formId,
							PrepaidinvoiceHeadItem.saga_gtxid
						).value,
						billpk: props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid)
							.value
					};
					showSagaErrorToast(props, params);
				}
			}
		});
	}, 0);
}
