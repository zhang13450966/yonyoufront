/*
 * @Author: qishy  
 * @PageInfo: 附件管理 
 * @Date: 2020-06-03 17:18:00  
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2021-03-13 12:27:35
*/

import { TARGET_CARD } from '../../siconst';
export default function() {
	let billId = this.props.form.getFormItemsValue(TARGET_CARD.formId, 'pk_target').value;
	let flag = this.state.showUploader;
	this.billId = billId;
	this.setState({
		showUploader: !flag
	});
}
