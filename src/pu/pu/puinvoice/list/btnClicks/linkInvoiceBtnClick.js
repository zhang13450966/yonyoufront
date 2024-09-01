/**
 * 联查收票
 */
import { AREA } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { NCModule } from '../../../pub/constance';
import sysModuleCheck from '../../../pub/remoteCall/sysModuleCheck';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickImageScanBtn(props) {
	let selrows = props.table.getCheckedRows(AREA.list_head);
	if (selrows.length == 0) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000051')); /* 国际化处理： 错误,请选择要联查的发票！*/
	}
	let imageDisableHint = getLangByResId(this, '4004PUINVOICE-000085'); //"共享发票管理模块没有启用！" add by congke
	sysModuleCheck.call(this, NCModule.SSCIVM, imageDisableHint, () => {
		const billId = selrows[0].data.values.pk_invoice.value;
		const billtype = selrows[0].data.values.vtrantypecode.value;
		const pk_org = selrows[0].data.values.pk_org.value;
		const tradetype = selrows[0].data.values.vtrantypecode.value;
		const viewRandom = randomNum();
		this.setState({ sscivmInvoiceData: { billId, billtype, pk_org, tradetype, viewRandom } });
	});
}
/**
 * 取得随机数
 */
function randomNum() {
	const crypto = window.crypto || window.msCrypto;
	var array = new Uint32Array(1);
	let rNum = crypto.getRandomValues(array)[0];
	return rNum / Math.pow(10, (rNum + '').length);
}
