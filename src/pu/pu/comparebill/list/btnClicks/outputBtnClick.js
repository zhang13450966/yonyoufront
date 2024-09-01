/*
 * @Author: qishy
 * @PageInfo:输出
 * @Date: 2019-04-29 09:32:19
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-05 10:41:14
 */
import { output } from 'nc-lightapp-front';
import { AREA, FIELDS, REQUESTURL } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let oids = [];
	let checkArr = props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004comarebill-000018')); /* 国际化处理 请选择数据 */
	}

	checkArr.map((row) => {
		oids.push(row.data.values[FIELDS.pk_comparebill].value);
	});
	output({
		url: REQUESTURL.print,
		data: { oids: oids, outputType: 'output' }
	});
}
