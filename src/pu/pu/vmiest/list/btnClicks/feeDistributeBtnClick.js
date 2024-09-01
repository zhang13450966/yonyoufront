/*
 * @Author: zhangshqb 
 * @PageInfo: 打开费用分摊 
 * @Date: 2018-06-26 11:37:10 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:20:44
 */
import { PAGECODE } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function feeDistributeBtnClick(props) {
	let index = this.props.editTable.getCheckedRows(PAGECODE.tableId)[0];
	if (this.feeItems && index) {
		let data = this.feeItems[index.data.values.pk_stockps_b.value];
		if (!data) {
			toast({
				content: getLangByResId(this, '4004VMIEST-000001'),
				color: 'warning',
				position: 'topRight'
			}); /* 国际化处理： 没有可以分摊的费用项！*/
			return;
		}
		let modaldata = {
			aeracode: PAGECODE.modaltablecode,
			rows: data.po_vmi_fee.rows
		};
		this.props.editTable.setTableData(PAGECODE.modaltablecode, modaldata);
		this.props.editTable.setStatus(PAGECODE.modaltablecode, 'edit');
		this.open();
	} else {
		let data = this.feeItems[index.data.values.pk_stockps_b.value];
		if (!data) {
			toast({
				content: getLangByResId(this, '4004VMIEST-000001'),
				color: 'warning',
				position: 'topRight'
			}); /* 国际化处理： 没有可以分摊的费用项！*/
			return;
		}
	}
}
