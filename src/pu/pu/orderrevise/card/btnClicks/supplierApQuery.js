/*
 * @Author: zhaochyu 
 * @PageInfo: 供应商应付
 * @Date: 2019-04-16 14:48:18 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-04-17 09:55:15
 */
import { PAGECODE, SUPPLIERAP } from '../../constance';
export default function grossProfitQuery(props) {
	let pk_org = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_org').value;
	let pk_supplier = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_supplier').value;
	let supplierapdata = {
		pk_org: pk_org,
		pk_supplier: pk_supplier,
		pagecode: SUPPLIERAP.PAGECODE
	};
	if (pk_org != null && pk_supplier != null) {
		this.setState({
			showSupplierApQuery: true,
			supplierapdata: supplierapdata
		});
	}
}
