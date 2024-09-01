import { print, toast } from 'nc-lightapp-front';
import { PAGECODE, FIELD, URL } from '../../constance';
export default function print_BtnClick(props) {
	let pk_pricesettle = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_pricesettle);
	pk_pricesettle = pk_pricesettle && pk_pricesettle.value;
	let pks = [];
	pks.push(pk_pricesettle);
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print,
		{
			funcode: '400403600',
			nodekey: '400403600', //模板节点标识
			oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
		}
	);
}
