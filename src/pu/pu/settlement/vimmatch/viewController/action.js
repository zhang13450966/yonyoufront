import { ajax } from 'nc-lightapp-front';
import { URL, AREA, PAGECODE, SETTLTTYPE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
class MatchAction {
	constructor(code, resid) {
		this.code = code;
		this.resid = resid;
	}
	doAction(page) {
		this.before(page);
		let props = page.props;
		let matachData = this.constructMatchData(page);
		ajax({
			method: 'post',
			url: URL.match,
			data: matachData,
			success: (res) => {
				if (res && res.data) {
					//props.beforeUpdatePage();
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(res.formulamsg);
					}
					page.state.matchmaterial = res.data[this.code].rows.map((row) => {
						let match = {};
						for (let key in row.values) {
							match[key] = row.values[key].value;
						}
						return match;
					});
					page.setState(
						{
							isSettle: true,
							isSuccess: false,
							title: getLangByResId(page, this.resid) /* 国际化处理： 同物料结算*/,
							matchcode: this.code
						},
						() => {
							page.props.editTable.setTableData(this.code, res.data[this.code]);
						}
					);
					MatchAction.showMatch(page);
					//props.updatePage(null, null, null, 'editTable');
				}
			}
		});
		this.after(page);
	}
	before(page) {
		page.state.btnName = 'SameMaterialSettle';
		page.state.settleType = SETTLTTYPE.SAME_MATERIAL;
	}
	after(page) {}

	constructMatchData(page) {
		let matachData = {};
		let props = page.props;
		let invoiceSet = new Set(
			(props.editTable.getCheckedRows(AREA.invoiceView) || []).map((row) => {
				return row.data.values.pk_invoice_b.value;
			})
		);
		let stockSet = new Set(
			(props.editTable.getCheckedRows(AREA.stockInVIew) || []).map((row) => {
				return row.data.values.pk_stockps_b.value;
			})
		);
		page.state.selectedInvoice = (page.state.invoice || []).filter((row) => {
			if (invoiceSet.has(row.values.pk_invoice_b.value)) {
				return true;
			} else {
				return false;
			}
		});
		page.state.selectedInvoice = page.state.selectedInvoice.length == 0 ? null : page.state.selectedInvoice;
		let invoice = page.state.selectedInvoice;
		page.state.selectedDiscount = (page.state.discount || []).filter((row) => {
			if (invoiceSet.has(row.values.pk_invoice_b.value)) {
				return true;
			} else {
				return false;
			}
		});
		page.state.selectedDiscount = page.state.selectedDiscount.length == 0 ? null : page.state.selectedDiscount;
		let discount = page.state.selectedDiscount;
		page.state.selectedFee = (page.state.fee || []).filter((row) => {
			if (invoiceSet.has(row.values.pk_invoice_b.value)) {
				return true;
			} else {
				return false;
			}
		});
		page.state.selectedFee = page.state.selectedFee.length == 0 ? null : page.state.selectedFee;
		let fee = page.state.selectedFee;
		page.state.selectedStock = (page.state.stock || []).filter((row) => {
			if (stockSet.has(row.values.pk_stockps_b.value)) {
				return true;
			} else {
				return false;
			}
		});
		page.state.selectedStock = page.state.selectedStock.length == 0 ? null : page.state.selectedStock;
		let stock = page.state.selectedStock;
		let environment = page.getSettleEnvironment();
		matachData.environment = environment;
		matachData.invoices = MatchAction.isEmpty(invoice)
			? null
			: {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: AREA.invoiceView,
						pageInfo: {},
						rows: invoice
					}
				};
		matachData.stocks = MatchAction.isEmpty(stock)
			? null
			: {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: AREA.stockInVIew,
						pageInfo: {},
						rows: stock
					}
				};
		matachData.discounts = MatchAction.isEmpty(discount)
			? null
			: {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: AREA.feeView,
						pageInfo: {},
						rows: discount
					}
				};
		matachData.fees = MatchAction.isEmpty(fee)
			? null
			: {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: AREA.feeView,
						pageInfo: {},
						rows: fee
					}
				};
		matachData.pagecode = PAGECODE.list;
		matachData.areacode = this.code;
		return matachData;
	}

	static showMatch(page) {
		let rows = [];
		if (!this.isEmpty(page.state.selectedDiscount)) {
			rows = rows.concat(page.state.selectedDiscount);
		}
		if (!this.isEmpty(page.state.selectedFee)) {
			rows = rows.concat(page.state.selectedFee);
		}
		page.props.editTable.setTableData(AREA.feeView, { rows: rows });
		// 退库单(负发票)不处理损耗；发票上的负合理损耗界面结算也不支持;只有同物料处理损耗
		let rowCount = page.props.editTable.getNumberOfRows(page.state.matchcode);
		let settleType = page.state.settleType;
		let hasFeeDistribute = page.state.hasFeeDistribute;
		let hasInoviceDistribute = page.state.hasInoviceDistribute;
		let canStlMnyCol = page.props.editTable.getColValue(page.state.matchcode, 'ncansettlemny');
		let reasonnumCol = page.props.editTable.getColValue(page.state.matchcode, 'nreasonwastenum');
		for (let index = 0; index < rowCount; index++) {
			let canStlMny = canStlMnyCol.value[index];
			let reasonnum = reasonnumCol.value[index];
			if (canStlMny < 0 || reasonnum < 0 || settleType != SETTLTTYPE.SAME_MATERIAL) {
				page.props.editTable.setValByKeyAndIndex(page.state.matchcode, index, 'nreasonwastenum', {
					value: null,
					display: null
				});
			}
		}
		page.props.editTable.setColEditableByKey(
			page.state.matchcode,
			[
				'ncurinvoicesettlenum',
				'ncurinvoicesettlemny',
				'nreasonwastenum',
				'ncurstocksettlenum',
				'nprice',
				'ncurseetlemny'
			],
			true
		);
		let busisys = 'po';
		(page.state.selectedStock || []).forEach((row) => {
			if ('50' == row.values.cbilltypecode.value) {
				busisys = 'voi_consume';
			}
		});
		let binvoiceCol = page.props.editTable.getColValue(page.state.matchcode, 'binvoice');
		let bstockCol = page.props.editTable.getColValue(page.state.matchcode, 'bstock');
		let editStatus = [];
		for (let index = 0; index < rowCount; index++) {
			let binvoice = binvoiceCol.value[index];
			let bstock = bstockCol.value[index];
			let canedit = {};

			if (binvoice) {
				canedit['ncurinvoicesettlenum'] = true;
				page.props.editTable.setEditableRowKeyByIndex(
					page.state.matchcode,
					index,
					[ 'ncurinvoicesettlenum' ],
					true
				);
				let canStlMny = canStlMnyCol.value[index];
				if (settleType == SETTLTTYPE.SAME_MATERIAL && 'po' == busisys && canStlMny > 0) {
					canedit['nreasonwastenum'] = true;
					page.props.editTable.setEditableRowKeyByIndex(
						page.state.matchcode,
						index,
						[ 'nreasonwastenum' ],
						true
					);
				}
			}
			if (settleType != SETTLTTYPE.FEE) {
				if (bstock) {
					canedit['ncurstocksettlenum'] = true;
					page.props.editTable.setEditableRowKeyByIndex(
						page.state.matchcode,
						index,
						[ 'ncurstocksettlenum' ],
						true
					);
					if (settleType == SETTLTTYPE.WITHOUT_INVOICE) {
						canedit['nprice'] = true;
						canedit['ncurseetlemny'] = true;
						page.props.editTable.setEditableRowKeyByIndex(
							page.state.matchcode,
							index,
							[ 'nprice', 'ncurseetlemny' ],
							true
						);
					}
					if (settleType == SETTLTTYPE.DIFFERENT_MATERIAL) {
						canedit['ncurinvoicesettlemny'] = true;
						page.props.editTable.setEditableRowKeyByIndex(
							page.state.matchcode,
							index,
							[ 'ncurinvoicesettlemny' ],
							true
						);
					}
				}
			}
			editStatus.push({ key: index, keys: canedit });
		}
		if (Array.isArray(editStatus) && editStatus.length > 0) {
			// page.props.editTable.setEditableKeyEdit(page.state.matchcode, editStatus);
		}

		if (
			(settleType == SETTLTTYPE.SAME_MATERIAL ||
				(settleType == SETTLTTYPE.DIFFERENT_MATERIAL && hasInoviceDistribute) ||
				settleType == SETTLTTYPE.FEE) &&
			!hasFeeDistribute &&
			(!this.isEmpty(page.state.selectedDiscount) || !this.isEmpty(page.state.selectedFee))
		) {
			page.props.button.setButtonVisible('FeeDistribute', true);
		} else {
			page.props.button.setButtonVisible('FeeDistribute', false);
		}
		if (
			(settleType == SETTLTTYPE.SAME_MATERIAL ||
				(settleType == SETTLTTYPE.DIFFERENT_MATERIAL && hasInoviceDistribute) ||
				settleType == SETTLTTYPE.FEE) &&
			hasFeeDistribute &&
			(!this.isEmpty(page.state.selectedDiscount) || !this.isEmpty(page.state.selectedFee))
		) {
			page.props.button.setButtonVisible('ShowFeeInvoice', true);
		} else {
			page.props.button.setButtonVisible('ShowFeeInvoice', false);
		}

		if (
			page.state.pk_financeorg &&
			((settleType == SETTLTTYPE.DIFFERENT_MATERIAL && (hasInoviceDistribute || hasFeeDistribute)) ||
				(settleType == SETTLTTYPE.FEE && hasFeeDistribute) ||
				settleType == SETTLTTYPE.SAME_MATERIAL ||
				settleType == SETTLTTYPE.WITHOUT_INVOICE)
		) {
			page.props.button.setButtonDisabled('Settle', false);
		} else {
			page.props.button.setButtonDisabled('Settle', true);
		}

		if (settleType == SETTLTTYPE.DIFFERENT_MATERIAL && !hasInoviceDistribute) {
			page.props.button.setButtonVisible('InvoiceDistribute', true);
			page.props.button.setButtonVisible('DistributeByMny', true);
			page.props.button.setButtonVisible('DistributeByNum', true);
		} else {
			page.props.button.setButtonVisible('InvoiceDistribute', false);
			page.props.button.setButtonVisible('DistributeByMny', false);
			page.props.button.setButtonVisible('DistributeByNum', false);
		}
		page.props.editTable.setStatus(page.state.matchcode, 'edit');
	}

	static isEmpty(value) {
		if (!value) {
			return true;
		} else if (Array.isArray(value)) {
			return value.length == 0;
		} else {
			return true;
		}
	}
}

export default MatchAction;
