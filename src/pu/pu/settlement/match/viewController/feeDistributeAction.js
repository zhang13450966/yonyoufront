import { ajax } from 'nc-lightapp-front';

import { AREA, URL, PAGECODE, SETTLTTYPE } from '../../constance';
import { afterBodyEdit } from '../events';
class FeeDistribueAction {
	static isEmpty(value) {
		if (!value) {
			return true;
		} else if (Array.isArray(value)) {
			return value.length == 0;
		} else {
			return true;
		}
	}
	static refreshHandle(page) {
		let props = page.props;
		let settleType = page.state.settleType;
		let hasFeeDistribute = page.state.hasFeeDistribute;
		let hasInoviceDistribute = page.state.hasInoviceDistribute;
		// 只有同物、异物(有已发票分摊V60与wangyf确认)、费用结算时，且已经选择了费用折扣发票，且未进行过分摊时可用
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
		if (settleType == SETTLTTYPE.FEE || !hasFeeDistribute || !hasInoviceDistribute) {
			return;
		}
	}
	static feeDistribute(page, iscontinue) {
		if (iscontinue) {
			let settleData = {};
			let matchVos = page.state.matchmaterial;
			let invoice = page.state.selectedInvoice;
			let stock = page.state.selectedStock;
			let discount = page.state.selectedDiscount;
			let fee = page.state.selectedFee;
			let environment = page.getSettleEnvironment();
			let uifee = page.props.editTable.getAllRows(AREA.feeView);
			let uimatch = page.props.editTable.getAllRows(page.state.matchcode);
			let state = {
				fdstate: page.state.hasFeeDistribute ? 'dist' : 'not_dist',
				idstate: page.state.hasInoviceDistribute ? 'dist' : 'not_dist'
			};
			settleData.matchMaterials = this.isEmpty(matchVos) ? null : matchVos;
			settleData.environment = environment;
			settleData.state = state;
			settleData.invoices = null;
			settleData.stocks = null;
			settleData.discounts = null;
			settleData.fees = null;
			settleData.uifees = null;
			settleData.uimatchMaterials = null;
			if (!this.isEmpty(invoice)) {
				settleData.invoices = {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: AREA.invoiceView,
						pageInfo: {},
						rows: invoice
					}
				};
			}
			if (!this.isEmpty(stock)) {
				settleData.stocks = {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: AREA.stockInVIew,
						pageInfo: {},
						rows: stock
					}
				};
			}

			if (!this.isEmpty(discount)) {
				settleData.discounts = {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: AREA.feeView,
						pageInfo: {},
						rows: discount
					}
				};
			}
			if (!this.isEmpty(fee)) {
				settleData.fees = {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: AREA.feeView,
						pageInfo: {},
						rows: fee
					}
				};
			}

			if (!this.isEmpty(uifee)) {
				settleData.uifees = {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: AREA.feeView,
						pageInfo: {},
						rows: uifee
					}
				};
			}

			if (!this.isEmpty(uimatch)) {
				settleData.uimatchMaterials = {
					pageid: PAGECODE.list,
					model: {
						areaType: 'table',
						areacode: page.state.matchcode,
						pageInfo: {},
						rows: uimatch
					}
				};
			}
			settleData.pagecode = PAGECODE.list;
			settleData.areacode = page.state.matchcode;
			ajax({
				method: 'post',
				url: URL.feeDistribute,
				data: settleData,
				success: (res) => {
					if (res.data && res.data.hasError) {
						if (res.data.errorType == '-32000') {
							page.props.modal.show('askPrice');
						} else {
							page.props.modal.show('matchValidation');
						}
					} else {
						// page.props.beforeUpdatePage();
						page.props.editTable.setTableData(page.state.matchcode, res.data[page.state.matchcode]);
						page.state.uiFee = {
							rows: uifee,
							areacode: AREA.feeView
						};
						page.state.matchmaterial = res.data[page.state.matchcode].rows.map((row) => {
							let match = {};
							for (let key in row.values) {
								match[key] = row.values[key].value;
							}
							return match;
						});
						page.state.hasFeeDistribute = true;

						this.refreshHandle(page);
						setTimeout(() => {
							page.props.editTable.setStatus(page.state.matchcode, 'browse');
						}, 0);
						//page.props.updatePage(null, null, null, 'editTable');
					}
				}
			});
		}
	}
	before(page) {}

	after(page) {
		let rows = page.props.editTable.getVisibleRows(AREA.feeView);
		for (let i = 0; i < rows.length; i++) {
			let ncursettleorigmny = page.props.editTable.getValByKeyAndIndex(AREA.feeView, i, 'ncursettleorigmny');
			if (ncursettleorigmny && ncursettleorigmny.value) {
				continue;
			}
			let ncurrentinvoicesettlemny = page.props.editTable.getValByKeyAndIndex(
				AREA.feeView,
				i,
				'ncurrentinvoicesettlemny'
			);
			let changerow = [
				{ oldvalue: { value: 0 }, newvalue: { value: ncurrentinvoicesettlemny.value }, rowid: rows[i].rowid }
			];
			afterBodyEdit.call(page, page.props, AREA.feeView, 'ncurrentinvoicesettlemny', null, changerow, i);
		}
	}

	doAction(page) {
		this.before(page);
		page.state.btnName = 'FeeDistribute';
		page.props.editTable.setStatus(AREA.feeView, 'edit');
		page.props.modal.show('feeDistribute');
		this.after(page);
	}
}
export default FeeDistribueAction;
