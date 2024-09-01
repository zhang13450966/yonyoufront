/*
 * @Author: zhengylr 
 * @Date: 2021-12-27
 */

import { toast } from 'nc-lightapp-front';
import { BUYINGREQ_LIST } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import poc from 'uap/common/components/printOnClient';
const { printPreview } = poc;

export default function buttonClick(props) {
	// 获取选中行

	let seldatas = props.table.getCheckedRows(BUYINGREQ_LIST.formId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (seldatas.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004PRAYBILL-000034') /* 国际化处理： 请选择要打印的订单！*/
		});
		return;
	}
	let pks = [];
	seldatas.map((item) => {
		pks.push(item.data.values.pk_praybill.value);
	});
	/**
	 * appcode 单据的应用编码（一般不用传，方法内部自己抓取，如果需要打印的模板和当前appcode不同，需要业务组自己传一下）
	 * nodekey 模板节点标识
	 * oids 单据主键
	 * printType 传true表示根据打印次数设置走插件打印，传false直接走pdf打印
	 * realData 传true表示打印真数据，传false表示打印假数据
	 * controlPrintNum 加了这个参数前端才会走打印次数查询，默认不走次数查询
	 */
	printPreview(props, BUYINGREQ_LIST.printURL, {
		appcode: props.getAppCode(),
		nodekey: 'listing_print',
		oids: pks,
		printType: true,
		realData: true,
		controlPrintNum: true
	});
}
