import {AREA} from '../../constance';
class ShowFeeInvoiceAction {
	doAction(page) {
        this.before(page);
        let props = page.props;
		page.state.btnName = 'ShowFeeInvoice';
		props.editTable.setStatus(AREA.feeView, 'browse');
		page.props.editTable.setTableData(AREA.feeView, page.state.uiFee);
		props.modal.show('feeDistribute');
		this.after(page);
	}

	before(page) {
		// TODO
	}

	after(page) {
		//TODO
	}
}
export default ShowFeeInvoiceAction;