/*
 * @Author: zhaochyu 
 * @PageInfo: 输出
 * @Date: 2018-07-26 19:42:14 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:03:06
 */
import { toast, output } from 'nc-lightapp-front';
import { PAGECODE, URL, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	//获取选中行
	let row = props.table.getCheckedRows(PAGECODE.tableId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (row.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004INITIALEST-000026')
		}); /* 国际化处理： 请选择要输出的订单！*/
		return;
	}
	let pks = [];
	row.map((item) => {
		pks.push(item.data.values.pk_initialest.value);
	});
	output({
		url: URL.print,
		data: { oids: pks, outputType: FIELD.output } // 功能节点的数据主键
	});
}
