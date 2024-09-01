import {AREA} from '../../constance';
class CloseAction {
	before(page) {}
	after(page) {}

	doAction(page) {
		before(page);
		after(page);
	}

	static close(page) {
		page.props.modal.close('settleRule');
		let invoiceSet = new Set();
		let stockSet = new Set();
		if (Array.isArray(page.state.settleBillVOs.pk_stock_b)) {
			stockSet = new Set(page.state.settleBillVOs.pk_stock_b);
		}
		if (Array.isArray(page.state.settleBillVOs.pk_invoice_b)) {
			invoiceSet = new Set(page.state.settleBillVOs.pk_invoice_b);
		}
		if (Array.isArray(page.state.stock)) {
			page.state.stock = page.state.stock.filter((item) => {
				return !stockSet.has(item.values.pk_stockps_b.value);
			});
		}
		if (Array.isArray(page.state.discount)) {
			page.state.discount = page.state.discount.filter((item) => {
				return !invoiceSet.has(item.values.pk_invoice_b.value);
			});
		}
		if (Array.isArray(page.state.invoice)) {
			page.state.invoice = page.state.invoice.filter((item) => {
				return !invoiceSet.has(item.values.pk_invoice_b.value);
			});
		}
		if (Array.isArray(page.state.fee)) {
			page.state.fee = page.state.fee.filter((item) => {
				return !invoiceSet.has(item.values.pk_invoice_b.value);
			});
		}
		page.setState(
			{
				activedTab: 0,
				stockinnum: 0,
				invoicemny: 0,
				invoicenum: 0,
				current: 'invoice',
				btnName: '',
				isSettle: false,
				isSuccess: false,
				isBack: true,
				invoicePriceOverOder: false,
				m_bAllowStockBeyondInvoice: false,
				settleType: '',
				title: '',
				hasFeeDistribute: false,
				hasInoviceDistribute: false,
				settleBillVOs: {},
				tab0Open: true,
				tab1Open: true,
				selectedInvoice: null,
				selectedDiscount: null,
				selectedFee: null,
				selectedStock: null,
				matchmaterial: null
			},
			() => {
				//setTimeout(() => {
					let invoiceRow = page.props.editTable.getAllRows(AREA.invoiceView);
					if (Array.isArray(invoiceRow)) {
						invoiceRow = invoiceRow.filter((item) => {
							return !invoiceSet.has(item.values.pk_invoice_b.value);
						});
					}
					let stockRow = page.props.editTable.getAllRows(AREA.stockInVIew);
					if (Array.isArray(stockRow)) {
						stockRow = stockRow.filter((item) => {
							return !stockSet.has(item.values.pk_stockps_b.value);
						});
					}
					page.props.editTable.setTableData(AREA.stockInVIew, {
						rows: stockRow || []
					});
					page.props.editTable.setTableData(AREA.invoiceView, {
						rows: invoiceRow || []
					});
					page.props.editTable.setCheckboxFix(AREA.invoiceView, !page.state.invoiceFull);
					page.props.editTable.setCheckboxFix(AREA.stockInVIew, !page.state.stockFull);
				//}
				//, 0);
			}
		);
	}
}

export default CloseAction;