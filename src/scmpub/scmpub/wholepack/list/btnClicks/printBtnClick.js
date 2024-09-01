import { print, output } from 'nc-lightapp-front';
import { PAGEAREA, FIELDS, URL } from '../constance';
import { showWarningInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props, isOutput = false) {
	let checkeddatas = props.editTable.getCheckedRows(PAGEAREA.list);
	if (checkeddatas.length == 0) {
		showWarningInfo(getLangByResId(this, '4001WHOLEPACK-000007'));/* 国际化处理： 请选择要打印的单据!*/
		return;
	}
	let pks = [];
	checkeddatas.forEach((item) => {
		let pk = item.data.values[FIELDS.pk_cwholepackid].value;
		pks.push(pk);
	});
	if (!isOutput) {
		print('pdf', URL.print, {
			oids: pks
		});
	} else {
		output({
			url: URL.print,
			data: {
				oids: pks,
				outputType: 'output'
			}
		});
	}
}
