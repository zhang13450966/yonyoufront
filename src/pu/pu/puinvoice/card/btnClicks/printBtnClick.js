/*
 * @Author: jiangfw
 * @PageInfo: 打印
 * @Date: 2018-07-07 14:15:28
 * @Last Modified by: zhr
 * @Last Modified time: 2021-11-18 20:01:26
 */
import { FIELD, URL, APPCODE, SCENE, BILLTYPE } from '../../constance';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

export default function clickPrintBtn(props) {
	// 获取选中行
	let pk_invoice = props.form.getFormItemsValue(this.formId, FIELD.pk_invoice).value;
	let pk_invoices = [];
	pk_invoices.push(pk_invoice);

	// 组装上送参数（这组参数和之前打印上送的参数是一样的，拿出来是为了添加审批中心时需要添加的属性）
	let printParams = {
		appcode: APPCODE.puinvoice,
		nodekey: APPCODE.puinvoice,
		oids: pk_invoices,
		printType: true,
		realData: true,
		controlPrintNum: true
	};
	// 审批场景再传这个参数（transactiontype-交易类型编码， billtype-单据类型，这两个参数每次只能传一个）
	if (
		props.getAppCode() == '400401614' ||
		SCENE.approvesce == props.getUrlParam(SCENE.scene) ||
		SCENE.ssctp == props.getUrlParam(SCENE.scene)
	) {
		// 其他情况，需要根据单据类型找维护应用
		printParams.billtype = BILLTYPE.invoice;
	}
	/**
	 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
	 * nodekey 模板节点标识
	 * oids 单据主键
	 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
	 * realData 传true表示打印真数据，传false表示打印假数据
	 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
	 * transactiontype 交易类型编码
	 * billtype 单据类型
	 */
	printPreview(props, URL.print, printParams);
}
