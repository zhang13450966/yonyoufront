import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax, toast } from 'nc-lightapp-front';
import { URL, AREA, PAGECODE, SETTLTTYPE } from '../../constance';
class BackSettleAction {
	before(page) {}

	after(page) {}

	doAction(page) {
		this.before(page);
		
		let date = page.getInitBillDate();
		
		page.setState({
			financeorg: page.state.mainorg,
			isShowUnit: !page.state.mainorg.refpk,
			dbilldate: {
				display:["#month(0)#","#day(0)#"],
				value: date
			},
			material: {},
			stockorg: {},
			marbasclass: {},
			supplier: {}
		})
		page.props.modal.show('backSettle');
		this.after(page);
	}

	static settle(page) {
		let queryInfo = page.getBackSettleSearchValue()
		if (!queryInfo) {
			return;
		}
		let meta = page.props.meta.getMeta();
		let invoiceOid = meta[AREA.invoiceSearchArea].oid;
		let stockOid = meta[AREA.stockInSearchArea].oid;
		ajax({
			method: 'post',
			url: URL.backSettle,
			data: {
				queryInfo: queryInfo,
				invoiceOid: invoiceOid,
				stockOid: stockOid
			},
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

export default BackSettleAction;
