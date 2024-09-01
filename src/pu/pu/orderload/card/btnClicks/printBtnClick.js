/*
 * @Author: xiahui 
 * @PageInfo: 打印
 * @Date: 2019-04-16 14:29:27 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-08 10:42:47
 */
import { AREA, URL, FIELDS, DATASOURCECACHE } from '../../constance';
import { print } from 'nc-lightapp-front';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
export default function(props) {
	let pk_order = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_order).value;
	let isLoad = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bisload);

	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print, //后台服务url
		{
			oids: [ pk_order ], // 功能节点的数据主键
			userjson: isLoad
		}
	);
}
