/*
 * @Author: liujia9 
 * @PageInfo: 打印
 * @Date: 2019-04-16 14:29:27 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-08 18:29:09
 */
import { AREA, URL, FIELD, DATASOURCECACHE } from '../../constance';
import { print } from 'nc-lightapp-front';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
export default function(props) {
	let pk_order = props.form.getFormItemsValue(AREA.CARD_FORM, FIELD.PK_ORDER).value;
	let confirm = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.CONFIRM); //从缓存里取confirm

	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.PRINT, //后台服务url
		{
			funcode: '400401002',
			nodekey: '400401002', //模板节点标识
			oids: [ pk_order ], // 功能节点的数据主键
			userjson: confirm
		}
	);
}
