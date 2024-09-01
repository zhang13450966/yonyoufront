import { print } from 'nc-lightapp-front';
import { URL } from '../constance';
import { showWarningInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
export default function print_BtnClick(props, id) {
	let seldatas = this.props.editTable.getCheckedRows(this.tableId).map((row) => {
		return row.data;
	});

	if (seldatas == null || seldatas.length == 0) {
		showWarningInfo(null, getLangByResId(this, '4001BATCHCODE-000005')); /* 国际化处理： 错误,请选择要打印的档案！*/
		return;
	}
	let pks = [];
	seldatas.forEach((element) => {
		pks.push(element.values.pk_batchcode.value);
	});
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print,
		{
			oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
		}
	);
}
