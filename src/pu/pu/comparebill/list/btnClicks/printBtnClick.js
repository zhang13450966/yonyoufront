/*
 * @Author: qishy 
 * @PageInfo: 打印
 * @Date: 2019-04-29 09:23:39 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-14 10:49:29
 */
import { print, ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, FIELDS } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	let oids = [];
	let checkArr = props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004comarebill-000018')); /* 国际化处理： 请选择数据*/
		return;
	}
	checkArr.map((row) => {
		oids.push(row.data.values[FIELDS.pk_comparebill].value);
	});

	// ajax({
	// 	url: REQUESTURL.printdatapermission,
	// 	data: oids,
	// 	success: (res) => {
	// 		if (res.success) {
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		REQUESTURL.print, //后台服务url
		{
			oids: oids // 功能节点的数据主键
		}
	);
}
// 		}
// 	});
// }
