/*
 * @Author: fangmj7 
 * @Date: 2022-01-04 15:06:44 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-29 15:14:48
 */

import { output } from 'nc-lightapp-front';
import { AREA, FIELD, URL, OHTER } from '../../constance';
import getParentURlParme from './getParentURlParme';
export default function buttonClick(props) {
	// 获取选中行

	let pk = props.form.getFormItemsValue(AREA.head, FIELD.hid).value;
	let pks = [];
	pks.push(pk);
	let parentURL = getParentURlParme(AREA.pageMsgType);
	let nodekey = '400401400';
	if (parentURL) {
		nodekey = '400401404';
	}
	output({
		url: URL.print,
		data: {
			nodekey: nodekey, //模板节点标识
			oids: pks,
			outputType: OHTER.outputType
		} // 功能节点的数据主键
	});
}
