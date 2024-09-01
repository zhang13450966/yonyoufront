import { ajax } from 'nc-lightapp-front';
import {
	URL,
	AREA,
	PAGECODE,
	SETTLTTYPE
} from '../../constance';

class DistributeByNumAction {

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
        let props = page.props
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
            (!this.isEmpty(this.state.selectedDiscount) || !this.isEmpty(this.state.selectedFee))
        ) {
            page.props.button.setButtonVisible('ShowFeeInvoice', true);
        } else {
            page.props.button.setButtonVisible('ShowFeeInvoice', false);
        }
        if (settleType == SETTLTTYPE.FEE || !hasFeeDistribute || !hasInoviceDistribute) {
            return;
        }
    
    }
	before(page) {}

	after(page) {}

	doAction(page) {
		this.before(page);
        let props = page.props;
		page.state.btnName = 'InvoiceDistributeByMny';
		let invoice = page.state.selectedInvoice;
		let discount = page.state.selectedDiscount;
		let fee = page.state.selectedFee;
		let stock = page.state.selectedStock;
		let uimatch = page.props.editTable.getAllRows(page.state.matchcode);
		let data = {
			invoices: DistributeByNumAction.isEmpty(invoice)
				? null
				: {
						pageid: PAGECODE.list,
						model: {
							areaType: 'table',
							areacode: AREA.invoiceView,
							pageInfo: {},
							rows: invoice
						}
					},
			discounts: DistributeByNumAction.isEmpty(discount)
				? null
				: {
						pageid: PAGECODE.list,
						model: {
							areaType: 'table',
							areacode: AREA.feeView,
							pageInfo: {},
							rows: discount
						}
					},
			fees: DistributeByNumAction.isEmpty(fee)
				? null
				: {
						pageid: PAGECODE.list,
						model: {
							areaType: 'table',
							areacode: AREA.feeView,
							pageInfo: {},
							rows: fee
						}
					},
			stocks: DistributeByNumAction.isEmpty(stock)
				? null
				: {
						pageid: PAGECODE.list,
						model: {
							areaType: 'table',
							areacode: AREA.stockInVIew,
							pageInfo: {},
							rows: stock
						}
					},
			matchMaterials: uimatch.map((row) => {
				let match = {};
				for (let key in row.values) {
					match[key] = row.values[key].value;
				}
				return match;
			}),
			pagecode: PAGECODE.list,
			areacode: page.state.matchcode
		};

		ajax({
			method: 'post',
			url: URL.invoiceDistributeByNum,
			data: data,
			success: (res) => {
				if (res && res.data && res.data[page.state.matchcode]) {
					//props.beforeUpdatePage();
					page.props.editTable.setTableData(page.state.matchcode, res.data[page.state.matchcode]);
					page.state.matchmaterial = res.data[page.state.matchcode].rows.map((row) => {
						let match = {};
						for (let key in row.values) {
							match[key] = row.values[key].value;
						}
						return match;
					});
					page.state.hasInoviceDistribute = true;

					DistributeByNumAction.refreshHandle(page);
					page.props.editTable.setStatus(page.state.matchcode, 'browse');
					//props.updatePage(null, null, null, 'editTable');
				}
			}
		});
		this.after(page);
    }
}  
export default DistributeByNumAction; 