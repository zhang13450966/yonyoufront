/*
 * @Author: zhangshqb 
 * @PageInfo: 单据追溯  
 * @Date: 2018-06-26 11:23:06 
 * @Last Modified by: zhangshqb 
 * @Last Modified time: 2018-06-26 11:23:06 
 */
import { PAGECODE } from '../../constance';
export default function linkQuery(props) {
	let pk = this.props.editTable.getCheckedRows(PAGECODE.tableId)[0].data.values.pk_stockps.value;
	this.setState({ pk: pk, showTrack: true });
}
