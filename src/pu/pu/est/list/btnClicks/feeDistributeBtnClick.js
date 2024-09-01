/*
 * @Author: zhangshqb 
 * @PageInfo: 打开费用分摊界面  
 * @Date: 2018-05-26 11:19:01 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-06-26 11:19:31
 */
import { PAGECODE } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function feeDistributeBtnClick(props) {
	let index = this.props.editTable.getCheckedRows(PAGECODE.tableId)[0];
	if (this.feeItem && index) {
		let data = this.feeItem;
		if (!data) {
			toast({
				content: getLangByResId(this, '4004EST-000001'),
				color: 'warning',
				position: 'topRight'
			}); /* 国际化处理： 没有可以分摊的费用项！*/
			return;
		}
		let fee = JSON.parse(JSON.stringify(data.po_stockps_fee));
		let modaldata = {
			aeracode: PAGECODE.modaltablecode,
			rows: fee.rows
		};
		async function setData() {
			await this.open();
			await this.props.editTable.setTableData(PAGECODE.modaltablecode, modaldata);
			await this.props.editTable.setStatus(PAGECODE.modaltablecode, 'edit');
		}
		setData.bind(this)();
	} else {
		let data = this.feeItem;
		if (!data) {
			toast({
				content: getLangByResId(this, '4004EST-000001'),
				color: 'warning',
				position: 'topRight'
			}); /* 国际化处理： 没有可以分摊的费用项！*/
			return;
		}
	}
}
