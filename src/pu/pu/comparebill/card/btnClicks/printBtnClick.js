/*
 * @Author: qishy 
 * @PageInfo: 打印
 * @Date: 2019-05-06 17:07:22 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-06 17:22:01
 */

import { print, ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, FIELDS } from '../../constance';
export default function(props) {
	let oids = [];
	let pk = props.form.getFormItemsValue(AREA.cardFormId, [ FIELDS.pk_comparebill ])[0].value;
	oids.push(pk);
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
	// 		}
	// 	}
	// });
}
