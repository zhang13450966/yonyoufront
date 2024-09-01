/*
 * @Author: jiangfw
 * @PageInfo: 费用发票
 * @Date: 2018-04-25 20:46:23
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:42:49
 */
import { AREA, UISTATE, URL, COMMON, PAGECODE } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import remoteSagasCheck from '../../utils/remoteSagasCheck';

export default function clickFeeInvoiceBtn(props) {
	let selrows = props.table.getCheckedRows(AREA.list_head);
	if (selrows.length == 0) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000050')); /* 国际化处理： 错误,未选择发票！*/
	}

	/**begain拉单界面费用发票不能编辑问题临时修改:拉单界面禁用费用发票按钮，后期酌情去掉-苏芬20181121 */
	// 清除缓存
	setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, null);
	/**end拉单界面费用发票不能编辑问题临时修改:拉单界面禁用费用发票按钮，后期酌情去掉-苏芬20181121 */

	let pk_invoice = selrows[0].data.values.pk_invoice.value;
	remoteSagasCheck.call(this, { pk: pk_invoice }, () => {
		props.pushTo(URL.card, {
			status: UISTATE.add,
			id: pk_invoice,
			feeFlag: true,
			pagecode: PAGECODE.invoiceCard
		});
	});
}
