/*
 * @Author: xiahui 
 * @PageInfo: 打印
 * @Date: 2019-04-16 15:13:07 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-07-11 09:13:00
 */

import { AREA, FIELDS, URL } from '../../constance';
import { print } from 'nc-lightapp-front';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let oids = [];
	let checkArr = props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004ORDERSENDOUT-000001')); /* 国际化处理： 请选择数据*/
		return;
	}

	checkArr.map((row) => {
		oids.push(row.data.values[FIELDS.pk_order].value);
	});

	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print, //后台服务url
		{
			oids: oids, // 功能节点的数据主键
			userjson: this.isSendout
		}
	);
}
