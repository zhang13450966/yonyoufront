/*
 * @Author: qishy 
 * @PageInfo: 附件管理操作
 * @Date: 2018-06-30 09:52:33 
 * @Last Modified by: qishy
 * @Last Modified time: 2020-06-24 14:31:53
 */
import { TARGETBILL_CONST, FIELD } from '../../const/const';
export default function() {
	let pk = this.props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_targetbill).value;
	if (!pk) {
		return;
	}
	let flag = this.state.showUploader;
	this.setState({
		billid: pk,
		showUploader: !flag
	});
}
