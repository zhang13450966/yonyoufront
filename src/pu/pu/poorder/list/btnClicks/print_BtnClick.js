/*
 * @Author: CongKe
 * @PageInfo: 打印
 * @Date: 2018-07-04 14:50:40
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-03-17 09:24:14
 */
import { toast } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import remoteCheck from '../../../pub/remoteCall/remoteCheck';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

export default function print_BtnClick(props) {
	let pks = [];
	let selrows = props.table.getCheckedRows(PAGECODE.tableId);
	if (selrows.length == 0) {
		toast({
			color: 'danger',
			content: getLangByResId(this, '4004POORDER-000071') /* 国际化处理： 请选择要打印的订单！*/
		});
		return;
	}
	let funcode = props.getAppCode();
	let scene = props.getUrlParam('scene');
	if (scene == 'freeze') {
		funcode = '400400800';
	}
	selrows.forEach((row) => {
		let pk = row.data.values.pk_order.value;
		if (pk) {
			pks.push(pk);
		}
	});
	let queryInfo = {
		pks: pks
	};
	remoteCheck.call(this, URL.printvalidate, queryInfo, () => {
		let printParams = {
			appcode: funcode,
			nodekey: '400400800',
			oids: pks,
			printType: true,
			realData: true,
			controlPrintNum: true
		};
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
