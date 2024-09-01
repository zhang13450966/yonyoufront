import { output, toast } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function printOutBtnClick(props) {
	let pks = [];
	let selrows = props.table.getCheckedRows(PAGECODE.tableId);
	if (selrows.length == 0) {
		toast({
			color: 'danger',
			content: getLangByResId(this, '4004PRICESTL-000025') /* 国际化处理： 请选择要输出的订单！*/ /* 国际化处理： 请选择要打印的订单！*/
		});
		return;
	}
	selrows.forEach((row) => {
		let pk = row.data.values.pk_pricesettle.value;
		if (pk) {
			pks.push(pk);
		}
	});
	output({
		url: URL.print,
		data: {
			oids: pks,
			nodekey: '400403600',
			outputType: 'output'
		}
	});
}
