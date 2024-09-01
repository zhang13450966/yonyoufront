/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 15:06:44 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 10:17:10
 */

import { print, toast } from 'nc-lightapp-front';
import { TARGET_LIST } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function buttonClick(props) {
	// 获取选中行

	let seldatas = props.table.getCheckedRows(TARGET_LIST.formId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (seldatas.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004PRAYBILLR-000022') /* 国际化处理： 请选择要打印的订单！*/
		});
		return;
	}
	let pks = [];
	seldatas.map((item) => {
		pks.push(item.data.values.pk_praybill.value);
	});
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		TARGET_LIST.printURL,
		{
			nodekey: '400400402', //模板节点标识
			oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
		}
	);
}
