/*
 * @Author: jiangfw
 * @PageInfo: 删除按钮
 * @Date: 2018-04-25 20:51:33
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-07-11 11:22:11
 */
import { ajax } from 'nc-lightapp-front';
import { URL, UISTATE, AREA, MODAL_ID, FIELD, COMMON, PAGECODE, TRANSFER_TYPE } from '../../constance';
import showResumeModal from '../utils/showResumeModal';
import { changeUrlParam, deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import pageInfoClick from './pageInfoClick';
import { getHeadValue } from '../utils/cardUtil';
import { showWarningDialog, showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function clickDelBtn(props, skipCodes) {
	showWarningDialog(
		getLangByResId(this, '4004PUINVOICE-000072') /* 国际化处理： 删除*/,
		getLangByResId(this, '4004PUINVOICE-000012') /* 国际化处理： 确认要删除吗？*/,
		{
			beSureBtnClick: () => {
				let rows = this.props.cardTable.getAllRows(AREA.card_body);
				let bodys = [];
				rows.forEach((row) => {
					bodys.push({
						id: row.values[FIELD.pk_invoice_b].value,
						ts: row.values[FIELD.ts].value
					});
				});
				let data = [];
				let row = {
					id: getHeadValue(props, FIELD.pk_invoice).value,
					ts: getHeadValue(props, FIELD.ts).value,
					bodys: bodys
				};
				data.push(row);
				// 拼装json
				let deleteInfo = {
					dataInfo: data,
					pagecode: PAGECODE.invoiceCard
				};
				let billpk = row.id;
				let _this = this;
				deleteInfo['skipCodes'] = skipCodes ? skipCodes : (skipCodes = new Array());
				ajax({
					url: URL.batchDelete,
					data: deleteInfo,

					success: function(res) {
						let { success } = res;
						if (success) {
							// 交互式异常处理
							if (res.data != null && res.data.isResume && res.data.isResume == true) {
								if (res.data.url) {
									res.data.url = '../../../../' + res.data.url;
								}
								showResumeModal.bind(_this)(
									props,
									MODAL_ID.MessageDlg,
									skipCodes,
									res.data,
									confirmdelet.bind(_this),
									confirmdelet.bind(_this),
									props
								);
								return;
							}

							// let type = props.getUrlParam('type');
							// if (type) {
							// 	if (props.transferTable.getTransformFormAmount(AREA.card_left) == 1) {
							// 		props.pushTo('/' + type, {
							// 			type: type
							// 		});
							// 	}
							let type = props.getUrlParam('type');
							if (type) {
								if (props.transferTable.getTransformFormAmount(AREA.card_left) == 1) {
									let url;
									let pagecode = '';
									if (
										type == TRANSFER_TYPE.invoice ||
										type == TRANSFER_TYPE.transfer21 ||
										type == TRANSFER_TYPE.transfer45 ||
										type == TRANSFER_TYPE.transfer4T
									) {
										// 收票
										url = URL.invoice;
										pagecode = PAGECODE.refAll_list;
									} else if (
										type == TRANSFER_TYPE.transferSc ||
										type == TRANSFER_TYPE.transfer47 ||
										type == TRANSFER_TYPE.transfer61
									) {
										// 委外收票
										url = URL.scInvoice;
										pagecode = PAGECODE.invoiceScAll;
									} else if (type == TRANSFER_TYPE.transfer50) {
										// 消耗汇总
										url = URL.transfer50;
										pagecode = PAGECODE.ref50_list;
									} else if (type == TRANSFER_TYPE.transfer21Pto25) {
										// 里程碑采购
										url = URL.transfer21Pto25;
										pagecode = PAGECODE.ref25_list;
									} else if (type == TRANSFER_TYPE.transfer55E6to25) {
										// 工序委外开票
										url = URL.transfer55E6to25;
										pagecode = PAGECODE.ref55E6_list;
									}
									props.pushTo(url, { pagecode: pagecode });
									// props.pushTo('/' + type, {
									// 	type: type
									// });
								} else {
									/**begain 多单编辑删除，下一条按钮控制有问题，20181129未提交 */
									_this.indexstatus = {};
									/**end 多单编辑删除，下一条按钮控制有问题，20181129未提交 */
									props.transferTable.setTransformFormStatus(AREA.card_left, {
										status: false,
										onChange: (current, next) => {
											showSuccessInfo(
												getLangByResId(_this, '4004PUINVOICE-000013' /* 国际化处理： 删除成功*/)
											);
										}
									});
								}
							} else {
								showSuccessInfo(getLangByResId(_this, '4004PUINVOICE-000013' /* 国际化处理： 删除成功*/));
								let nextId = getNextId(props, props.getUrlParam('id'), COMMON.PuinvoiceCacheKey);
								changeUrlParam(props, {
									status: UISTATE.browse,
									id: nextId
								});

								pageInfoClick.call(_this, props, nextId);
							}
							deleteCacheData(props, FIELD.pk_invoice, billpk, COMMON.PuinvoiceCacheKey);
							// 控制按钮状态
							// toggleShow.call(_this);
						}
					},
					error: (res) => {
						showErrorInfo(res.message);
					}
				});
			}
		}
	);
}

function confirmdelet(props, skipCodes) {
	let data = [];
	let row = {
		id: getHeadValue(props, FIELD.pk_invoice).value,
		ts: getHeadValue(props, FIELD.ts).value
	};
	data.push(row);
	// 拼装json
	let deleteInfo = {
		dataInfo: data,
		pagecode: PAGECODE.invoiceCard
	};

	let _this = this;
	deleteInfo['skipCodes'] = skipCodes ? skipCodes : (skipCodes = new Array());
	ajax({
		url: URL.batchDelete,
		data: deleteInfo,

		success: function(res) {
			let { success } = res;
			if (success) {
				// 交互式异常处理
				if (res.data != null && res.data.isResume && res.data.isResume == true) {
					if (res.data.url) {
						res.data.url = '../../../../' + res.data.url;
					}
					showResumeModal.bind(_this)(
						props,
						MODAL_ID.MessageDlg,
						skipCodes,
						res.data,
						confirmdelet.bind(_this),
						confirmdelet.bind(_this),
						props
					);
					return;
				}

				let type = props.getUrlParam('type');
				if (type) {
					if (props.transferTable.getTransformFormAmount(AREA.card_left) == 1) {
						let url;
						let pagecode = '';
						if (
							type == TRANSFER_TYPE.invoice ||
							type == TRANSFER_TYPE.transfer21 ||
							type == TRANSFER_TYPE.transfer45 ||
							type == TRANSFER_TYPE.transfer4T
						) {
							// 收票
							url = URL.invoice;
							pagecode = PAGECODE.refAll_list;
						} else if (
							type == TRANSFER_TYPE.transferSc ||
							type == TRANSFER_TYPE.transfer47 ||
							type == TRANSFER_TYPE.transfer61
						) {
							// 委外收票
							url = URL.scInvoice;
							pagecode = PAGECODE.invoiceScAll;
						} else if (type == TRANSFER_TYPE.transfer50) {
							// 消耗汇总
							url = URL.transfer50;
							pagecode = PAGECODE.ref50_list;
						}
						props.pushTo(url, { pagecode: pagecode });
						// props.pushTo('/' + type, {
						// 	type: type
						// });
					} else {
						/**begain 多单编辑删除，下一条按钮控制有问题，20181129未提交 */
						_this.indexstatus = {};
						/**end 多单编辑删除，下一条按钮控制有问题，20181129未提交 */
						props.transferTable.setTransformFormStatus(AREA.card_left, {
							status: false,
							onChange: (current, next) => {
								showSuccessInfo(getLangByResId(_this, '4004PUINVOICE-000013' /* 国际化处理： 删除成功*/));
							}
						});
					}
				} else {
					showSuccessInfo(getLangByResId(_this, '4004PUINVOICE-000013' /* 国际化处理： 删除成功*/));
					let nextId = getNextId(props, props.getUrlParam('id'), COMMON.PuinvoiceCacheKey);
					props.form.EmptyAllFormValue(AREA.card_head);
					props.cardTable.setTableData(AREA.card_body, { rows: [] });
					deleteCacheData(props, FIELD.pk_invoice, props.getUrlParam('id'), COMMON.PuinvoiceCacheKey);
					changeUrlParam(props, {
						status: UISTATE.browse,
						id: nextId
					});

					pageInfoClick.call(_this, props, nextId);
				}
				// 控制按钮状态
				// toggleShow.call(_this);
			}
		},
		error: (res) => {
			showErrorInfo(res.message);
		}
	});
}
