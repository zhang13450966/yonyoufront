import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';
export default function checkdatapermissionClick(record, oprcode, callBack) {
	let id = '';
	if (record) {
		id = record.pk_order.value;
	} else {
		let pk_pricesettle = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_pricesettle);
		id = pk_pricesettle && pk_pricesettle.value;
	}
	if (id == null) {
		callBack && callBack();
	}
	let pks = new Array();
	pks.push(id);
	let data = {
		pks: pks,
		actionCode: oprcode
	};
	ajax({
		url: URL.editdatapermission,
		data: data,
		method: 'post',
		success: (res) => {
			if (res && res.success) {
				callBack && callBack();
			}
		}
	});
}
