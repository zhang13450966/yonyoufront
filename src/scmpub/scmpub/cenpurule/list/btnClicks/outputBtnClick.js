/*
 * @Author: lichao 
 * @PageInfo: 输出  
 * @Date: 2019-03-12 16:04:06 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-03-13 16:54:52
 */
import { output, toast } from 'nc-lightapp-front';
import { URL, FIELD, AREACODE, FUNCODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function outputButtonClick(props) {
	// 获取选中行
	let seldatas = props.cardTable.getCheckedRows(AREACODE.listHead);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (seldatas.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4001CENPURULE-000002')/* 国际化处理：  请选择要打印的订单！*/
		});
		return;
	}
	let pks = [];
	seldatas.map((item) => {
		pks.push(item.data.values.pk_cenpurule.value);
	});

	output({
		url: URL.print,
		data: {
			funcode: FUNCODE, //小应用编码
			oids: pks, // 功能节点的数据主键
			outputType: 'output'
		}
	});
}
