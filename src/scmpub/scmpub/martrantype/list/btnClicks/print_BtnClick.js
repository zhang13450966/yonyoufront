/*
 * @Author: yechd5
 * @PageInfo: 打印按钮点击事件 
 * @Date: 2018-07-05 19:50:25 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-02 10:37:23
 */
import { print } from 'nc-lightapp-front';
import { MARTRANTYPE_CONST } from '../const';

export default function print_BtnClick(props) {
	const selectedData = props.editTable.getCheckedRows(MARTRANTYPE_CONST.TABLEID);
	let ids = new Array();
	for (let i = 0; i < selectedData.length; i++) {
		ids.push(selectedData[i].data.values.pk_martrantype.value);
	}

	print(
		MARTRANTYPE_CONST.PRINTTYPE, // 支持两类: 'html'为模板打印, 'pdf'为pdf打印
		MARTRANTYPE_CONST.PRINTURL,
		{
			nodekey: MARTRANTYPE_CONST.NODEKEY, // 模板节点标识
			oids: ids // 功能节点的数据主键 oids含有多个元素时为批量打印,
		}
	);
}
