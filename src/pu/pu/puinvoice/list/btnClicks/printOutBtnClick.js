/*
 * @Author: jiangfw 
 * @PageInfo: 输出
 * @Date: 2018-07-07 14:28:12 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-10-26 16:05:11
 */
import { output } from 'nc-lightapp-front';
import { URL, APPCODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickPrintOutBtn(props) {
	// 获取选中行
	let invoives = props.table.getCheckedRows(this.tableId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (invoives.length == 0) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000052')); /* 国际化处理： 错误,请选择要打印的订单！*/
		return;
	}
	let pk_invoices = [];
	invoives.map((item) => {
		pk_invoices.push(item.data.values.pk_invoice.value);
	});

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
