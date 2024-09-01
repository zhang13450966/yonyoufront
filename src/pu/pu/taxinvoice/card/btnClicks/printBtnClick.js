/*
 * @Author: wanglzh7 
 * @PageInfo:打印
 * @Date: 2018-07-06 10:53:31 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-10-20 10:08:59
 */
import { print, ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, FIELDS } from '../../constance';
export default function(props) {
	let oids = [];
	let pk_taxinvoice = props.form.getFormItemsValue(AREA.cardFormId, [ FIELDS.pk_taxinvoice ])[0].value;
	oids.push(pk_taxinvoice);
	ajax({
		url: REQUESTURL.printdatapermission,
		data: oids,
		success: (res) => {
			if (res.success) {
				print(
					'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
					REQUESTURL.print, //后台服务url
					{
						oids: oids // 功能节点的数据主键
					}
				);
			}
		}
	});
}
