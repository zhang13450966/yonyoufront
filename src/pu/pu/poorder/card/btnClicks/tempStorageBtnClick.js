/*
 * @Author: zhaochyu
 * @PageInfo: 暂存
 * @Date: 2019-05-08 11:03:36
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-07 16:10:06
 */
import { ACTIONS } from 'scmpub/scmpub/components/TempSave';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { PAGECODE, STATUS, OrderCache, FIELD } from '../../constance';
export default function temporaryStorage(props) {
	let config = {
		pagecode: PAGECODE.cardcode,
		formId: PAGECODE.cardhead,
		tableId: [ PAGECODE.cardbody, PAGECODE.head_payment ],
		type: 'card',
		param: FIELD.pk_material,
		area: PAGECODE.cardbody
	};
	setDefData(OrderCache.OrderCardCache, 'tempsave', true);
	ACTIONS.SAVE.call(this, props, config, checkTempSave.bind(this));
}
function checkTempSave() {
	let status = this.props.getUrlParam(STATUS.tempstatus);
	let add = getDefData(OrderCache.OrderCardCache, 'scene');
	if (status == undefined && add == undefined) {
		return true;
	}
	if (status == STATUS.add || add == 'ADD') {
		return true;
	}
	return false;
}
