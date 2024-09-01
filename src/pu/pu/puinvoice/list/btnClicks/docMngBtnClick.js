/*
 * @Author: jiangfw
 * @PageInfo: 附件管理
 * @Date: 2018-07-02 16:56:15
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-30 15:58:52
 */
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function docMngBtnClick(props) {
	// 获取选中行
	let rows = props.table.getCheckedRows(this.tableId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		showWarningInfo(
			null,
			getLangByResId(this, '4004PUINVOICE-000049') /* 国际化处理： 请注意,请选择需要操作的数据！*/
		);
		return;
	}
	let pk_invoice = rows[0].data.values.pk_invoice.value;
	let billcode = rows[0].data.values.vbillcode.value;
	let flag = this.state.showUploader;

	this.setState({
		pk_invoice: pk_invoice,
		billcode,
		showUploader: !flag,
		// target: event.target
	});
}
