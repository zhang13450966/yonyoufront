import { FIELD } from '../../constance';

/*
 * @Author: jiangfw
 * @PageInfo:单据追溯
 * @Date: 2018-06-30 16:47:17
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-12-19 17:26:29
 */
export default function queryAboutBusinessBtnClick(props) {
	// 获取选中行
	let pk_invoice = this.props.form.getFormItemsValue(this.formId, FIELD.pk_invoice).value;
	this.setState({ pk_invoice: pk_invoice, showTrack: true });
}
