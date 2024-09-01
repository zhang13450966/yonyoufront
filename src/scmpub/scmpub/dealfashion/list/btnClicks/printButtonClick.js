/*
 * @Author: lichao 
 * @PageInfo: 输出  
 * @Date: 2019-03-12 16:04:25 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-05-31 17:31:53
 */
import { print, toast } from 'nc-lightapp-front';
import { URL, AREACODE, FUNCODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props) {
	// 获取所有
	let seldatas = props.editTable.getAllRows(AREACODE);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (seldatas.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4001DEALFASHION-000002')/* 国际化处理：  页面为空，不能打印！*/
		});
		return;
	}
	let pks = [];
	seldatas.map((item) => {
		pks.push(item.values.pk_dealfashion.value);
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
