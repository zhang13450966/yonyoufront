import { FIELD, PAGECODE, URL, TRANSFER } from '../../constance';
import vbillcodeBeforeEvent from './vbillcodeBeforeEvent';
export default async function(props, moduleId, key, value) {
	let flag = true;
	let constance = {};
	if (key == FIELD.vbillcode) {
		constance = {
			key: FIELD.vbillcode,
			formareaid: PAGECODE.cardhead,
			pk_org_key: FIELD.pk_org,
			billtype: PAGECODE.billType
		};
		flag = await vbillcodeBeforeEvent.call(this, props, constance);
	}
	return flag;
}
