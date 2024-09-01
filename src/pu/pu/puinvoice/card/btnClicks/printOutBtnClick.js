/*
 * @Author: jiangfw 
 * @PageInfo: 输出
 * @Date: 2018-07-07 14:28:12 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-09-02 21:38:15
 */
import { output } from 'nc-lightapp-front';
import { URL, APPCODE, FIELD } from '../../constance';

export default function clickPrintOutBtn(props) {
	// 获取选中行
	let pk_invoice = props.form.getFormItemsValue(this.formId, FIELD.pk_invoice).value;
	let pk_invoices = [];
	pk_invoices.push(pk_invoice);

	output({
		// 'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		url: URL.print, //后台服务url
		data: {
			funcode: APPCODE.puinvoice, //功能节点编码，即模板编码
			nodekey: APPCODE.puinvoice, //模板节点标识
			oids: pk_invoices, // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
			outputType: 'output'
		}
	});
}
