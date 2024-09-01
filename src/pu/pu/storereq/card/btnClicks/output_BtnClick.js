/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 15:06:44 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-08-15 09:44:36
 */

import { output } from 'nc-lightapp-front';
import { STOREREQ_LIST, STOREREQ_CARD, ATTRCODE } from '../../siconst';
import getParentURlParme from './getParentURlParme';
export default function buttonClick(props) {
	// 获取选中行
	
	let pk = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_storereq).value;
	let pks = [];
	pks.push(pk);
	let parentURL = getParentURlParme(STOREREQ_CARD.pageMsgType);
	let nodekey = '400400000';
	if (parentURL) {
		nodekey = '400400002';
	}
	output({
		url: STOREREQ_LIST.printURL,
		data: {
			nodekey: nodekey, //模板节点标识
			oids: pks,
			outputType: STOREREQ_LIST.outputType
		} // 功能节点的数据主键
	});
}
