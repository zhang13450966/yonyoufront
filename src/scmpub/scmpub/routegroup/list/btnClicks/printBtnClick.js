/*
 * @Author: 王勇 
 * @PageInfo: 列表-运输路线打印  
 * @Date: 2020-01-17 09:50:45 
 * @Last Modified by: yangls7
 * @Last Modified time: 2020-07-07 16:43:04
 */
import { APPINFO, TEMPLATEINFO, REQUESTURL, ROUTEVOINFO } from '../../const/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../pub/tool/messageUtil';
import { print } from 'nc-lightapp-front';
export default function printBtnClick(props) {
	let allroutes = props.table.getCheckedRows(TEMPLATEINFO.listAreaCode);

	if (allroutes.length == 0) {
		showWarningInfo(null, getLangByResId(this, '4001ROUTE-000010')); /**请选择要打印的数据 */
		return;
	}
	let pks = [];
	allroutes.forEach((row) => {
		let id = row.data.values[ROUTEVOINFO.crouteid].value;
		pks.push(id);
	});

	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		REQUESTURL.printRouteUrl,
		{
			funcode: APPINFO.appCode,
			// nodekey: TEMPLATEINFO.nodeKey,
			oids: pks //
		}
	);
}
