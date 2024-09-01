import { AREA, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { NCModule } from '../../../pub/constance';
import sysModuleCheck from '../../../pub/remoteCall/sysModuleCheck';

export default function clickImageScanBtn(props) {
	let imageDisableHint = getLangByResId(this, '4004PUINVOICE-000085'); //"共享发票管理模块没有启用！" add by congke
	sysModuleCheck.call(this, NCModule.SSCIVM, imageDisableHint, () => {
		const billId = props.form.getFormItemsValue(AREA.card_head, FIELD.pk_invoice).value;
		const billtype = props.form.getFormItemsValue(AREA.card_head, FIELD.vtrantypecode).value;
		const pk_org = props.form.getFormItemsValue(AREA.card_head, FIELD.pk_org).value;
		const tradetype = props.form.getFormItemsValue(AREA.card_head, FIELD.vtrantypecode).value;
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
