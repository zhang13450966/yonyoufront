import {
	URL,
	AREA,
	PAGECODE,

} from '../../constance';
import { ajax } from 'nc-lightapp-front';

class SettleAction {

    static isEmpty(value) {
		if (!value) {
			return true;
		} else if (Array.isArray(value)) {
			return value.length == 0;
		} else {
			return true;
		}
    }

    static settle(page, iscountinue) {
            if (iscountinue) {
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
        
                ajax({
                    method: 'post',
                    url: URL.settle,
                    data: settleData,
                    success: (res) => {
                        if (res && res.data && res.data.hasError) {
                            if (res.data.errorType == '-32000') {
                                page.props.modal.show('askPrice');
                            } else {
                                page.props.modal.show('matchValidation');
                            }
                        } else {
                            page.state.settleBillVOs = res.data || {};
                            page.setState({
                                isSuccess: true
                            });
                        }
                    }
                });
            }
    }

	before(page) {}

	after(page) {}

	doAction(page) {
		this.before(page);
        page.state.btnName = 'Settle';
		SettleAction.settle(page, true);
		this.after(page);
	}
}
export default SettleAction;
