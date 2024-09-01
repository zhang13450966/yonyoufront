import { AREA } from '../../constance/index';

/*
 * @Author: jiangfw 
 * @PageInfo:单据追溯
 * @Date: 2018-06-30 16:47:17 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-25 16:58:45
 */
export default function queryAboutBusinessBtnClick(props) {
	// 获取选中行
	let pk_invoice = props.table.getCheckedRows(AREA.list_head)[0].data.values.pk_invoice.value;
	this.setState({ pk_invoice: pk_invoice, showTrack: true });
}
