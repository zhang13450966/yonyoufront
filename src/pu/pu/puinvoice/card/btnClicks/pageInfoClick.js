/*
 * @Author: jiangfw
 * @PageInfo: 卡片上一页下一页
 * @Date: 2018-05-07 08:35:41
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-12-09 16:58:47
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, COMMON, AREA, FIELD } from '../../constance';
import { changeUrlParam, getCacheDataByPk, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { setOrgEdit } from '../utils/cardUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import btnController from '../viewControl/btnController';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
let formId = AREA.card_head;
let tableId = AREA.card_body;

export default function(props, pk_invoice, refresh) {
	let billcodeStr = '';
	if (pk_invoice == undefined || !pk_invoice) {
		// if (UISTATE.browse == props.getUrlParam('status')) return;
		billcodeStr = '';
		this.props.form.EmptyAllFormValue(formId);
		this.props.cardTable.setTableData(tableId, { rows: [] });
		this.setBillHeadInfo(billcodeStr);
		// 设置按钮可用性
		btnController.call(this);
		// 主组织编辑性
		setOrgEdit(props);
		return;
	}

	let cacheData = getCacheDataByPk(props, COMMON.PuinvoiceCacheKey, pk_invoice);
	if (cacheData && !refresh) {
		billcodeStr = cacheData.head[formId].rows[0].values.vbillcode.value;
		this.props.form.setAllFormValue({ [formId]: cacheData.head[formId] });
		this.props.cardTable.setTableData(tableId, cacheData.body[tableId], null, true, true);

		this.setBillHeadInfo(billcodeStr);
		// 设置按钮可用性
		btnController.call(this);
		// 主组织编辑性
		setOrgEdit(props);
		showSagaErrorToasts(this.props, formId, FIELD.pk_invoice);
		return;
	}

	let data = { pks: [pk_invoice], pagecode: PAGECODE.invoiceCard };
	this.pk_invoice = pk_invoice;
	ajax({
		url: URL.queryCard,
		data: data,
		success: res => {
			if (res.data === undefined) {
				billcodeStr = '';
				this.props.form.EmptyAllFormValue(formId);
				this.props.cardTable.setTableData(tableId, { rows: [] });
			}
			if (res.data.head && res.data.body) {
				// 执行公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}

				billcodeStr = res.data.head[formId].rows[0].values.vbillcode.value;
				this.props.form.setAllFormValue({
					[formId]: res.data.head[formId],
				});
				// NCCLOUD-94561-卡片表体有翻页增加参数
				this.props.cardTable.setTableData(tableId, res.data.body[tableId], null, true, true);
				updateCacheData(
					props,
					FIELD.pk_invoice,
					res.data.head[formId].rows[0].values.pk_invoice.value,
					res.data,
					formId,
					COMMON.PuinvoiceCacheKey
				);
			}
			this.setBillHeadInfo(billcodeStr);
			// 设置按钮可用性
			btnController.call(this);
			// 主组织编辑性
			setOrgEdit(props);
			showSagaErrorToasts(this.props, formId, FIELD.pk_invoice);
		},
		error: res => {
			showErrorInfo(res.message);
		},
	});

	changeUrlParam(props, { id: pk_invoice });
}
