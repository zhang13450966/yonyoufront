import { output, toast } from 'nc-lightapp-front';
import { PAGECODE, FIELD, URL } from '../../constance';
export default function printOutBtnClick(props) {
	let pk_pricesettle = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_pricesettle);
	pk_pricesettle = pk_pricesettle && pk_pricesettle.value;
	let pks = [];
	pks.push(pk_pricesettle);
	output({
		url: URL.print,
		data: {
			oids: pks,
			nodekey: '400403600',
			outputType: 'output'
		}
	});
}
