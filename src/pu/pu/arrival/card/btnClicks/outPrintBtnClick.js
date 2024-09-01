/*
 * @Author: zhangshqb 
 * @PageInfo: 到货单卡片态按钮 输出
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
 */
import { output } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance';
export default function() {
	let id = this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value;
	output({
		url: URL.print,
		data: {
			oids: [ id ],
			outputType: 'output',
			billtype: '23', //单据类型
			funcode: '400401200', //功能节点编码，即模板编码
			nodekey: null
		} //模板节点标识
	});
}
