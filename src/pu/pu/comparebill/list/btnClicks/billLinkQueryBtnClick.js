/*
 * @Author: chaiwx 
 * @PageInfo: 单据追溯 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-04-30 16:47:18
 */
import { FIELDS, AREA } from '../../constance';

export default function(props) {
	let pk_comparebill = props.table.getCheckedRows(AREA.listTableId)[0].data.values[FIELDS.pk_comparebill].value;
	this.setState({ pk_comparebill: pk_comparebill, showTrack: true });
}
