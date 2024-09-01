/*
 * @Author: CongKe 
 * @PageInfo: 仅适用于订单在途状态列表查询区公共编辑后
 * @Date: 2019-04-18 14:29:36 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-04-18 15:01:08
 */
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';

let pk_org = 'pk_org';
// 查询区编辑后
function onAfterEvent(props, field, val, searchId) {
	if (field == pk_org) {
		multiCorpRefHandler(props, val, searchId, [
			'pk_payterm',
			'pk_supplier',
			'cemployeeid',
			'pk_dept',
			'pk_invcsupllier',
			'approver',
			'billmaker',
			'pk_recvcustomer',
			'pk_order_b.pk_srcmaterial',
			'pk_order_b.pk_srcmaterial.code',
			'pk_order_b.pk_srcmaterial.name',
			'pk_order_b.vvendinventorycode',
			'pk_order_b.vvendinventoryname',
			'pk_order_b.pk_srcmaterial',
			'pk_order_b.pk_srcmaterial.pk_marbasclass',
			'vdef1',
			'vdef2',
			'vdef3',
			'vdef4',
			'vdef5',
			'vdef6',
			'vdef7',
			'vdef8',
			'vdef9',
			'vdef10',
			'vdef11',
			'vdef12',
			'vdef13',
			'vdef14',
			'vdef15',
			'vdef16',
			'vdef17',
			'vdef18',
			'vdef19',
			'vdef20',
			'pk_order_b.vfree1',
			'pk_order_b.vfree2',
			'pk_order_b.vfree3',
			'pk_order_b.vfree4',
			'pk_order_b.vfree5',
			'pk_order_b.vfree6',
			'pk_order_b.vfree7',
			'pk_order_b.vfree8',
			'pk_order_b.vfree9',
			'pk_order_b.vfree10',
			'pk_order_b.vbdef1',
			'pk_order_b.vbdef2',
			'pk_order_b.vbdef3',
			'pk_order_b.vbdef4',
			'pk_order_b.vbdef5',
			'pk_order_b.vbdef6',
			'pk_order_b.vbdef7',
			'pk_order_b.vbdef8',
			'pk_order_b.vbdef9',
			'pk_order_b.vbdef10',
			'pk_order_b.vbdef11',
			'pk_order_b.vbdef12',
			'pk_order_b.vbdef13',
			'pk_order_b.vbdef14',
			'pk_order_b.vbdef15',
			'pk_order_b.vbdef16',
			'pk_order_b.vbdef17',
			'pk_order_b.vbdef18',
			'pk_order_b.vbdef19',
			'pk_order_b.vbdef20'
		]);
	} else if (field == 'pk_order_b.pk_reqstoorg') {
		multiCorpRefHandler(props, val, searchId, [ 'pk_order_b.pk_reqstordoc' ]);
	} else if (field == 'pk_order_b.pk_arrvstoorg') {
		multiCorpRefHandler(props, val, searchId, [ 'pk_order_b.pk_recvstordoc' ]);
	}
}

function renderCompleteEvent(props, searchId) {
	let org = props.search.getSearchValByField(searchId, pk_org);
	if (org && org.value && org.value.firstvalue) {
		let value = org.value.firstvalue;
		let arr = value.split(',');
		arr = arr.map((item) => {
			return { refpk: item };
		});
		onAfterEvent(this.props, pk_org, arr, searchId);
	}
}

export { onAfterEvent, renderCompleteEvent };
