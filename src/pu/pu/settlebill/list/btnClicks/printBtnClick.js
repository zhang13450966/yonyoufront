import { toast, print } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function printBtnClick(props) {
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	if (rows.length == 0) {
		toast({ content: getLangByResId(this, '4004SETTLEBILL-000008'), color: 'warning' }); /* 国际化处理： 请先选择数据*/
		return;
	}
	let ids = rows.map((row) => {
		return row.data.values.pk_settlebill.value;
	});
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print, //后台服务url
		{
			billtype: '27', //单据类型
			nodekey: null, //模板节点标识
			oids: ids // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
			// 打印按钮不用传该参数,输出按钮(文件下载)需加参数outputType,值为output。
		}
	);
}
