/*
 * @Author: lichao 
 * @PageInfo:打印   
 * @Date: 2019-03-12 16:09:32 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-03-13 16:53:12
 */
import { print, toast } from 'nc-lightapp-front';
import { URL, FIELD, ORGTYPE, AREACODE, FUNCODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props) {
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

	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print,
		{
			funcode: FUNCODE, //小应用编码
			oids: pks // 功能节点的数据主键
		}
	);
}
