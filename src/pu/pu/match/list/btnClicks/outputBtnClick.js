/*
 * @Author: xiahui 
 * @PageInfo: 输出
 * @Date: 2019-06-06 08:58:13 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-07-11 09:44:52
 */
import { AREA, FIELDS, URL } from '../../constance';
import { output } from 'nc-lightapp-front';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let checkArr = props.editTable.getCheckedRows(AREA.matchedId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004MATCH-000005')); /* 国际化处理： 请选择数据*/
		return;
	}

	let oids = [];
	checkArr.map((row) => {
		oids.push(row.data.values[FIELDS.pk_taxmatch].value);
	});

	output({
		url: URL.print,
		data: {
			oids: oids,
			outputType: 'output'
		}
	});
}
