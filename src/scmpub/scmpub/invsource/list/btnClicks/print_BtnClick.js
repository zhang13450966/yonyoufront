/*
 * @Author: 王龙华 
 * @PageInfo: 打印按钮点击事件 
 * @Date: 2018-07-04 20:07:24 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-07-30 14:38:00
 */

import { print} from 'nc-lightapp-front';
import { INVSOURCE_CONST } from '../../const';

export default function print_BtnClick(props) {
	let len = props.editTable.getNumberOfRows(INVSOURCE_CONST.TABLEID);
	let ids = new Array();
	for (let i = 0; i < len; i++) {
		let data = props.editTable.getValByKeyAndIndex(INVSOURCE_CONST.TABLEID,i,'pk_invsource').value;
		ids.push(data);
	}

	print(
		INVSOURCE_CONST.PRINT_TYPE, // 支持两类: 'html'为模板打印, 'pdf'为pdf打印
		INVSOURCE_CONST.PRINT_URL,
		{
			funcode: INVSOURCE_CONST.FUNCODE, // 功能节点编码，即模板编码
			nodekey: '400100000', // 模板节点标识
			oids: ids // 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
		}
	);
}
