/*
 * @Author: zhaochyu 
 * @PageInfo: 供应商应付
 * @Date: 2019-04-16 14:48:18 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-02-21 14:41:59
 */
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PAGECODE, SUPPLIERAP } from '../../constance';
export default function grossProfitQuery(props) {
	let pk_org = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_org').value;
	let pk_supplier = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_supplier').value;
	if (!pk_org) {
		showWarningInfo(getLangByResId(this, '4004POORDER-000135')); /** 请选择采购组织！ */
		return;
	}
	if (!pk_supplier) {
		showWarningInfo(getLangByResId(this, '4004POORDER-000136')); /** 请选择供应商！ */
		return;
	}
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
