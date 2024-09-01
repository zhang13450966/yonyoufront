/*
 * @Author: CongKe
 * @PageInfo: 订单卡片打印
 * @Date: 2018-07-05 10:25:42
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-05-21 17:11:36
 */
import { PAGECODE, FIELD, URL } from '../../constance';
import remoteCheck from '../../../pub/remoteCall/remoteCheck';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

export default function print_BtnClick(props) {
	let pk = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
	let pks = [];
	pks.push(pk);
	let queryInfo = {
		pks: pks
	};
	remoteCheck.call(this, URL.printvalidate, queryInfo, () => {
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
			nodekey: '400400802',
			oids: pks,
			printType: true,
			realData: true,
			controlPrintNum: true
		});
	});
}
