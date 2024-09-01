/*
 * @Author: xiahui 
 * @PageInfo: 打印 
 * @Date: 2019-05-20 09:48:55 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-07-11 09:44:55
 */
import { AREA, FIELDS, URL } from '../../constance';
import { print } from 'nc-lightapp-front';
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

	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print, //后台服务url
		{
			oids: oids // 功能节点的数据主键
		}
	);
}
