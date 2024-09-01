/*
 * @Author: zhengylr
 * @PageInfo: 打印清单
 * @Date: 2018-07-07 14:28:12
 */
import { URL, APPCODE } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

export default function clickPrintBtn(props) {
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
	/**
	 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
	 * nodekey 模板节点标识
	 * oids 单据主键
	 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
	 * realData 传true表示打印真数据，传false表示打印假数据
	 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
	 */
	printPreview(props, URL.print, {
		appcode: props.getAppCode(),
		nodekey: 'listing_print',
		oids: pk_invoices,
		printType: true,
		realData: true,
		controlPrintNum: true
	});
}
