/*
 * @Author: zhaochyu 
 * @PageInfo: 卡片态输出功能 
 * @Date: 2018-09-05 15:18:07 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-02 15:57:20
 */
import { output } from 'nc-lightapp-front';
import { PAGECODE, URL, FIELD } from '../../constance';
export default function(props) {
	let pks = [];
	let pk = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_initialest).value;
	pks.push(pk);
	output({
		url: URL.print,
		data: { oids: pks, outputType: FIELD.output } // 功能节点的数据主键
	});
}
