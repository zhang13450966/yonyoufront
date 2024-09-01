/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 15:06:44 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-07-08 16:15:17
 */

import { toast, output } from 'nc-lightapp-front';
import { STOREREQ_LIST } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props) {
	// 获取选中行
	
	let seldatas = props.table.getCheckedRows(STOREREQ_LIST.formId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (seldatas.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004STOREREQ-000024') /* 国际化处理： 请选择要输出的订单！*/
		});
		return;
	}
	let pks = [];
	seldatas.map((item) => {
		pks.push(item.data.values.pk_storereq.value);
	});
	output({
		url: STOREREQ_LIST.printURL,
		data: {
			nodekey: '400400000', //模板节点标识
			oids: pks,
			outputType: STOREREQ_LIST.outputType
		} // 功能节点的数据主键
	});
}
