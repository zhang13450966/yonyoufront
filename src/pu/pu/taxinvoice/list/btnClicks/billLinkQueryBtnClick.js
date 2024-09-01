/*
 * @Author: chaiwx 
 * @PageInfo: 单据追溯 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-06-27 09:01:16
 */
import { FIELDS, AREA } from '../../constance';

export default function(props) {
	let pk_taxinvoice = props.table.getCheckedRows(AREA.listTableId)[0].data.values[FIELDS.pk_taxinvoice].value;
	this.setState({ pk_taxinvoice: pk_taxinvoice, showTrack: true });
}
