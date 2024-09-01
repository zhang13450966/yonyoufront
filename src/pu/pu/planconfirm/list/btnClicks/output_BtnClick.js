/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 15:06:44 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-02 20:58:58
 */

import { output, toast } from 'nc-lightapp-front';
import { AREA, URL, OHTER } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props) {
	// 获取选中行

	let seldatas = props.table.getCheckedRows(AREA.head);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (seldatas.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004planconfirm-000032') /* 国际化处理： 请选择要输出的进度确认单！*/
		});
		return;
	}
	let pks = [];
	seldatas.map((item) => {
		pks.push(item.data.values.pk_planconfirm.value);
	});
	output({
		url: URL.print,
		data: {
			//nodekey: '400401400', //模板节点标识
			oids: pks,
			outputType: OHTER.outputType
		} // 功能节点的数据主键
	});
}
