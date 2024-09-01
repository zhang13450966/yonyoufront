/*
 * @Author: liujia9 
 * @PageInfo: 打印
 * @Date: 2019-04-16 15:13:07 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-08 16:40:50
 */

import { AREA, FIELD, URL, DATASOURCECACHE } from '../../constance';
import { print } from 'nc-lightapp-front';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from 'src/scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
export default function(props) {
	let oids = [];
	let checkArr = props.table.getCheckedRows(AREA.LIST_HEAD);
	let confirm = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.CONFIRM);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004ORDERCONFIRM-000001'));
		/* 国际化处理： 请选择数据*/
		return;
	}

	checkArr.map((row) => {
		oids.push(row.data.values.pk_order.value);
	});

	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.PRINT, //后台服务url
		{
			funcode: '400401002',
			nodekey: '400401002', //模板节点标识
			oids: oids, // 功能节点的数据主键
			userjson: confirm
		}
	);
}
