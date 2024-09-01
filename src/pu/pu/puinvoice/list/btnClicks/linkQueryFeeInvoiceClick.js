/*
 * @Author: jiangfw 
 * @PageInfo:单据追溯
 * @Date: 2018-06-30 16:47:17 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-02-02 11:31:19
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function linkQueryFeeInvoiceClick(props) {
	let selrows = props.table.getCheckedRows(AREA.list_head);
	if (selrows.length == 0) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000051')); /* 国际化处理： 错误,请选择要联查的发票！*/
	}

	let pk_invoice = selrows[0].data.values.pk_invoice.value;
	let data = {
		id: pk_invoice
	};

	// this.setState({
	// 	// pk_invoice,
	// 	showLinkFee: true
	// 	// dagreData: data
	// });

	ajax({
		url: URL.linkFeeInvoice,
		data: data,

		success: (res) => {
			if (res.success) {
				if (res.data && res.data.length > 1) {
					let data = dataFormat(res.data);
					this.setState({
						// pk_invoice,
						showLinkFee: true
						// dagreData: data
					});
					this.setState({
						pk_invoice,
						// showLinkFee: true,
						dagreData: data
					});
				} else {
					showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000017')); /* 国际化处理： 提示,所选发票没有关联费用发票!*/
				}
			}
		}
	});
}

function dataFormat(data) {
	return data.map((item) => {
		let { lightBillVO, sourceList, forwardList, isForward } = item;
		let { billID, billCode, billType, billTypeName } = lightBillVO;
		return {
			label: billTypeName + '\n' + billCode,
			id: billID,
			type: billType,
			billID: billID,
			billCode: billCode,
			billTypeName: billTypeName,
			source: sourceList || [],
			target: forwardList || [],
			isForward
		};
	});
}
