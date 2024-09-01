import { output } from 'nc-lightapp-front';
import { URL } from '../../constance';
export default function printBtnClick(props) {
	let id = this.props.getUrlParam('id');
	output({
		url: URL.print, //后台服务url
		data: {
			outputType: 'output',
			billtype: '27', //单据类型
			nodekey: null, //模板节点标识
			oids: [id], // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
			// 打印按钮不用传该参数,输出按钮(文件下载)需加参数outputType,值为output。
		},
	});
}
