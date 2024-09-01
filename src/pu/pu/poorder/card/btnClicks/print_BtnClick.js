/*
 * @Author: CongKe
 * @PageInfo: 订单卡片打印
 * @Date: 2018-07-05 10:25:42
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-03-17 09:24:00
 */
import { PAGECODE, FIELD, URL, OrderCache } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import remoteCheck from '../../../pub/remoteCall/remoteCheck';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

export default function print_BtnClick(props) {
	let scene = getDefData(OrderCache.OrderCardCache, FIELD.scene);
	let funcode = props.getAppCode();
	let billtype = null;
	let nodekey = '400400800';
	if (scene == FIELD.approvesce) {
		// 审批的打印模板
		nodekey = '4004008006';
		funcode = '400400808';
		billtype = PAGECODE.billType;
	} else if (scene == 'freeze' || scene == 'ADD') {
		funcode = '400400800';
	}
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
	pk_order =
		pk_order == null || pk_order == '' || pk_order == 'undefined' || pk_order == 'null'
			? props.getUrlParam(FIELD.id)
			: pk_order;
	pk_order = pk_order == '' || pk_order == 'undefined' || pk_order == 'null' ? null : pk_order;
	let pks = [];
	pks.push(pk_order);
	let queryInfo = {
		pks: pks
	};
	remoteCheck.call(this, URL.printvalidate, queryInfo, () => {
		let printParams = {
			appcode: funcode,
			nodekey: nodekey,
			oids: pks,
			printType: true,
			realData: true,
			controlPrintNum: true
		};

		// 审批场景再传这个参数（transactiontype-交易类型编码， billtype-单据类型，这两个参数每次只能传一个）
		if (
			props.getAppCode() == '400400812' ||
			FIELD.approvesce == getDefData(OrderCache.OrderCardCache, FIELD.scene)
		) {
			// 其他情况，需要根据单据类型找维护应用
			printParams.billtype = PAGECODE.billType;
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
	});
}
