/*
 * @Author: zhaochyu
 * @PageInfo: 付款执行情况
 * @Date: 2019-04-22 14:01:15
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-16 21:47:37
 */
import { pageTo, viewModel } from 'nc-lightapp-front';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;

import { PAGECODE } from '../../constance';
export default function payExecStatBtnClick(props) {
	let str = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_org').value;
	let strname = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_org').display;
	let vbillcode = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'vbillcode').value;
	let LinkReport = {
		logic: 'and',
		conditions: [
			{
				field: 'po_order.pk_org',
				value: {
					firstvalue: str,
					secondvalue: ''
				},
				oprtype: '=',
				display: strname,
				isIncludeSub: false,
				refurl: '',
				datatype: '204'
			},
			{
				field: 'po_order.vbillcode',
				value: { firstvalue: vbillcode, secondvalue: '' },
				oprtype: '=',
				display: vbillcode,
				isIncludeSub: false,
				refurl: '',
				datatype: '1'
			}
		]
	};
	setGlobalStorage('localStorage', 'LinkReport', JSON.stringify(LinkReport));
	let params = {
		'po_order.pk_org': this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_org'),
		'po_order.vbillcode': this.props.form.getFormItemsValue(PAGECODE.cardhead, 'vbillcode'),
		'po_order.dbilldate': this.props.form.getFormItemsValue(PAGECODE.cardhead, 'dbilldate').value.substr(0, 10)
	};
	// pageTo.openTo('/pu/pu/report/orderprayexecquery/index.html', {
	// 	appcode: '400413208',
	// 	pageCode: '400413208_report',
	// 	params: JSON.stringify(params)
	// });
	this.props.openTo(null, {
		appcode: '400413208',
		pageCode: '400413208_report',
		params: JSON.stringify(params)
	});
}
