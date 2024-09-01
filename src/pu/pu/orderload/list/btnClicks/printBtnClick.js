/*
 * @Author: CongKe
 * @PageInfo: 打印
 * @Date: 2019-04-16 14:29:27
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-30 17:58:02
 */
import { AREA, URL, FIELDS, DATASOURCECACHE } from '../../constance';
import { print } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(props) {
	let oids = [];
	let checkArr = props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		// 请选择数据
		showWarningInfo(null, getLangByResId(this, '4004LOAD-000003'));
		return;
	}
	checkArr.forEach(element => {
		let checkLine = element.data.values;
		let pk_order = checkLine && checkLine[FIELDS.pk_order] && checkLine[FIELDS.pk_order].value;
		oids.push(pk_order);
	});
	let isLoad = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bisload);
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print, //后台服务url
		{
			oids: oids, // 功能节点的数据主键
			userjson: isLoad,
		}
	);
}
