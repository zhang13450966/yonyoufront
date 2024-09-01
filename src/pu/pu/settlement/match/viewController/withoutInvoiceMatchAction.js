import MatchAction from './action';
import {SETTLTTYPE } from '../../constance';
class WithoutInvoiceMatchAction extends MatchAction {
    constructor(){
        super('withoutInvoice', '4004SETTLEMENT-000004');
    }
    before(page) {
        page.state.btnName = 'WithoutInvoiceSettle';
		page.state.settleType = SETTLTTYPE.WITHOUT_INVOICE; 
    }
}
export default WithoutInvoiceMatchAction;