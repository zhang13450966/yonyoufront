/*
 * @Author: qishy 
 * @PageInfo:卡片附件按钮
 * @Date: 2019-04-29 15:38:42 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-04-30 14:40:21
 */
import { AREA, FIELDS } from '../../constance';

export default function(props) {
	let flag = this.state.showUploader;
	let pk = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill).value;
	this.setState({
		pk_comparebill: pk,
		showUploader: !flag
	});
}
