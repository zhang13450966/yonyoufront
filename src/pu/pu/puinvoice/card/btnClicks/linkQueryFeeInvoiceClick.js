/*
 * @Author: jiangfw 
 * @PageInfo:单据追溯
 * @Date: 2018-06-30 16:47:17 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-02-02 11:28:59
 */
import { ajax } from 'nc-lightapp-front';
import { FIELD, URL } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function linkQueryFeeInvoiceClick(props) {
	let pk_invoice = props.form.getFormItemsValue(this.formId, FIELD.pk_invoice).value;

	let data = {
		id: pk_invoice
	};

	ajax({
		url: URL.linkFeeInvoice,
		data: data,

		success: (res) => {
			if (res.success) {
				if (res.data && res.data.length > 1) {
					let data = dataFormat(res.data);
					this.setState({
						showLinkFee: true
					});
					this.setState(
						{
							// pk_invoice,
							// showLinkFee: true,
							dagreData: data
						},
						() => {
							console.log(this.state.dagreData, 9999);
						}
					);
					// this.showLinkFee = true;
					// this.dagreData = data;
				} else {
					showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000017') /* 国际化处理：提示,所选发票没有关联费用发票!*/);
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
