
import {
	URL,
	AREA,
	PAGECODE,
	SETTLTTYPE,
} from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
class AutoSettleAction {

	doAction(page) {
        this.before(page);
        let props = page.props;
		page.state.btnName = 'AutoSettle';
		page.state.invoicePriceOverOder = false;
		page.state.settleType = SETTLTTYPE.UI_AUTO;
		let invoice = page.state.invoice;
		let fee = page.state.fee;
		let discount = page.state.discount;
		let stock = page.state.stock;
        
		if (AutoSettleAction.isEmpty(invoice) && AutoSettleAction.isEmpty(stock) && AutoSettleAction.isEmpty(discount) && AutoSettleAction.isEmpty(fee)) {
			toast({
				content: getLangByResId(page, '4004SETTLEMENT-000000'),
				color: 'warning'
			}); /* 国际化处理： 无任何可结算入库单和采购发票！*/
			return;
		}

		AutoSettleAction.autoSettle(page, true);

		this.after(page);
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

    static autoSettle(page, iscontinue) {
        let invoice = page.state.invoice;
        let fee = page.state.fee;
        let discount = page.state.discount;
        let stock = page.state.stock;
        let environment = page.getSettleEnvironment();
        let settleData = {};
        settleData.environment = environment;
        settleData.invoices = this.isEmpty(invoice, AREA.invoiceView)
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
        settleData.stocks = this.isEmpty(stock)
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
        settleData.discounts = this.isEmpty(discount)
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
        settleData.fees = this.isEmpty(fee)
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
        settleData.state = {
            fdstate: page.state.hasFeeDistribute ? 'dist' : 'no_dist',
            idstate: page.state.hasInoviceDistribute ? 'dist' : 'no_dist'
        };
        if (iscontinue) {
            {
                ajax({
                    method: 'post',
                    url: URL.autoSettle,
                    data: settleData,
                    success: (res) => {
                        if (res.data && res.data.hasError) {
                            page.props.modal.show('askPrice');
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
    }
	before(page) {}

	after(page) {}
}

export default AutoSettleAction;
