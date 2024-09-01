/*
 * @Author: 刘奇 
 * @PageInfo: 输出 
 * @Date: 2018-07-28 15:11:54 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2018-10-22 15:16:11
 */

import { output } from 'nc-lightapp-front';
import { showWarningInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { URL, AREA } from '../constance';
export default function output_BtnClick(props) {
	let tableId = AREA.tableArea;
	let selectedData = props.editTable.getCheckedRows(tableId);
	if (selectedData.length <= 0) {
		showWarningInfo(null, getLangByResId(this, '4001BATCHCODE-000003')); /* 国际化处理： 请选择要输出的档案！*/
		return;
	}
	let oids = new Array();
	selectedData.forEach((val) => {
		oids.push(val.data.values.pk_batchcode.value);
	});
	output({
		url: URL.print,
		data: { oids: oids, outputType: 'output' }
	});
}
