/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 15:06:44 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-07-08 16:04:37
 */

import { output } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';

export default function buttonClick(props) {
	// 获取选中行
	
	let pk = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value;
	let pks = [];
	pks.push(pk);
	output({
		url: BUYINGREQ_LIST.printURL,
		data: {
			nodekey: '400400402', //模板节点标识
			oids: pks,
			outputType: BUYINGREQ_LIST.outputType
		} // 功能节点的数据主键
	});
}
