/*
 * @Author: xiahui 
 * @PageInfo: 打印
 * @Date: 2019-04-16 14:29:27 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-04-17 10:08:36
 */
import { AREA, URL, FIELDS } from '../../constance';
import { print } from 'nc-lightapp-front';

export default function(props) {
	let pk_order = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_order).value;

	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print, //后台服务url
		{
			oids: [ pk_order ], // 功能节点的数据主键
			userjson: props.getUrlParam('sendout')
		}
	);
}
