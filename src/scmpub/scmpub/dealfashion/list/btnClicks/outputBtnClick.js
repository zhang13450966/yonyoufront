/*
 * @Author: lichao 
 * @PageInfo: 输出  
 * @Date: 2019-03-12 16:04:06 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-05-31 17:31:41
 */
import { output, toast } from 'nc-lightapp-front';
import { URL, FIELD, AREACODE, FUNCODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function outputButtonClick(props) {
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

	output({
		url: URL.print,
		data: {
			funcode: FUNCODE, //小应用编码
			oids: pks, // 功能节点的数据主键
			outputType: 'output'
		}
	});
}
