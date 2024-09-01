/*
 * @Author: chaiwx 
 * @PageInfo: 附件管理 
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-02-13 15:39:54
 */
import { AREA, FIELDS } from '../../constance';

export default function(props) {
	let flag = this.state.showUploader;
	let pk = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value;

	this.setState({
		pk_taxinvoice: pk,
		showUploader: !flag
		// target: event.target
	});
}
