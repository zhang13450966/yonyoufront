/*
 * @Author: CongKe 
 * @PageInfo: 到货计划
 * @Date: 2018-06-27 13:13:14 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-22 16:44:48
 */
import { toast } from 'nc-lightapp-front';
import { FIELD, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function arrivePlanBtn(props) {
	props = this.props;
	let selectedRow = this.props.table.getCheckedRows(PAGECODE.tableId);
	if (selectedRow.length != 1) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000065') /* 国际化处理： 请选择一行数据！*/
		});
		return;
	}
	let pk_order = selectedRow[0].data.values.pk_order.value;
	this.setState({
		showModal: true,
		pk_order: pk_order
	});
}
