/*
 * @Author: zhaochyu 
 * @PageInfo: 付款执行情况
 * @Date: 2019-04-22 14:01:15 
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-16 21:55:08
 */
import { toast, pageTo } from 'nc-lightapp-front';
import { PAGECODE, SALESQUERY, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo, showBatchOperateInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function payExecStatBtnClick(props) {
	let selectedRow = props.table.getCheckedRows(PAGECODE.tableId);
	if (selectedRow == null || selectedRow.length == 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000051') /* 国际化处理： 请选择行！*/
		});
		return;
	}
	let arrstr = [];
	let str = '';
	let vbillcode = '';
	selectedRow.map((item) => {
		if (item.data.values.pk_org.value) {
			arrstr.push(item.data.values.pk_org.value);
		}
		if (item.data.values.vbillcode.value) {
			vbillcode += item.data.values.vbillcode.value + ',';
		}
	});
	let strSet = [ ...new Set(arrstr) ];
	for (let i = 0; i < strSet.length; i++) {
		str += strSet[i] + ',';
	}
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
				display: null,
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
	localStorage.setItem('LinkReport', JSON.stringify(LinkReport));
	// pageTo.openTo('/pu/pu/report/orderprayexecquery/index.html', {
	// 	appcode: '400413208',
	// 	pageCode: '400413208_report'
	// });
	let params;
	if (selectedRow && selectedRow.length == 1) {
		params = {
			'po_order.pk_org': selectedRow[0].data.values['pk_org'],
			'po_order.vbillcode': selectedRow[0].data.values['vbillcode'],
			'po_order.dbilldate': selectedRow[0].data.values['dbilldate'].value.substr(0, 10)
		};
	}

	this.props.openTo(null, {
		appcode: '400413208',
		pageCode: '400413208_report',
		params: JSON.stringify(params)
	});
}
