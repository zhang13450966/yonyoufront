import { ajax, toast } from 'nc-lightapp-front';
import { URL, AREA, PAGEID, FIELD } from '../../constance';
import vbillcodeBeforeEvent from './vbillcodeBeforeEvent';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
export default function(id, key, value, record) {
	if (
		[
			'pk_arriveorder',
			'pk_purchaseorg',
			'pk_purchaseorg_v',
			'pk_supplier_v',
			'pk_supplier',
			'pk_busitype',
			'pk_org_v',
			'pk_org',
			'bisback',
			'vtrantypecode',
			'iprintcount'
		].includes(key)
	) {
		return false;
	} else if (key == FIELD.vbillcode) {
		return vbillcodeBeforeEvent.call(this, this.props);
	} else if (key == 'vbackreason') {
		// let isBack = record.values.vbackreason.value
		let isBack = this.props.form.getFormItemsValue(AREA.form, 'bisback').value;
		if (isBack) {
			return true;
		}
		return false;
	} else if (key == 'ctrantypeid') {
		if (this.isapprove == 'Y') {
			return false;
		}
		let transty = transtypeUtils.beforeEdit.call(this, key, 'ctrantypeid', 'vtrantypecode');
		return transty;
	}
	return true;
}
