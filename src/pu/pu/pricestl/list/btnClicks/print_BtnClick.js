import { print, toast } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function print_BtnClick(props) {
	let pks = [];
	let selrows = props.table.getCheckedRows(PAGECODE.tableId);
	if (selrows.length == 0) {
		toast({
			color: 'danger',
			content: getLangByResId(this, '4004PRICESTL-000026') /* 国际化处理： 请选择要打印的订单*//* 国际化处理： 请选择要打印的订单！*/
		});
		return;
	}
	selrows.forEach((row) => {
		let pk = row.data.values.pk_pricesettle.value;
		if (pk) {
			pks.push(pk);
		}
	});
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
