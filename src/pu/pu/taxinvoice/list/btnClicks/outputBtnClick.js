/*
 * @Author: chaiwx 
 * @PageInfo: 输出
 * @Date: 2018-07-06 11:07:23 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-09-20 12:37:58
 */
import { output } from 'nc-lightapp-front';
import { AREA, REQUESTURL, FIELDS } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let oids = [];
	let checkArr = this.props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000009')); /* 国际化处理： 请选择数据*/
		return;
	}
	checkArr.map((row) => {
		oids.push(row.data.values[FIELDS.pk_taxinvoice].value);
	});

	output({
		url: REQUESTURL.print,
		data: { oids: oids, outputType: 'output' }
	});
}
