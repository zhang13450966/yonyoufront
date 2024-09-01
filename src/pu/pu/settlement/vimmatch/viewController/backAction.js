import { ajax } from 'nc-lightapp-front';
import {URL} from '../../constance';
class BackAction {
    before(page){

    }

    after(page) {

    }

    doAction(page) {
        this.before(page);
        page.state.btnName = 'Back';
			let settleBillVOs = (page.state.settleBillVOs || {}).settlevos || [];
			//page.props.modal.close('settleRule');
			ajax({
				method: 'post',
				url: URL.cancelSetele,
				data: settleBillVOs,
				success: (res) => {
					if (res.success) {
						page.setState({
							invoiceFull: false,
							stockFull: false,
							isSettle: false,
							isSuccess: false,
							isBack : true,
							invoicePriceOverOder: false,
							settleType: '',
							title: '',
							hasFeeDistribute: false,
							hasInoviceDistribute: false,
							m_bAllowStockBeyondInvoice: false,
							settleBillVOs: {},
							tab0Open: true,
							tab1Open: true,
							selectedInvoice: null,
							selectedDiscount: null,
							selectedFee: null,
							selectedStock: null,
							matchmaterial: null,
							invoicemny:0,
							invoicenum:0,
							stockinnum:0


						});
					}
				}
			});
        this.after(page);
    }
}
export default BackAction;