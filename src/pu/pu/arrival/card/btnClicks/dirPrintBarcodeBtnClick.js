/*
 * @Author: zhangshqb 
 * @PageInfo: 到货单卡片态按钮 直接打印条形码
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-17 09:11:31
 */
import { print } from 'nc-lightapp-front';
// import codeNfig from '../../../../../uap/commmon/components/codeConfigModal';
import codeNfig from 'uap/common/components/codeConfigModal';
import { AREA, BILLTYPE } from '../../constance';
export default function() {
	let id = this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value;
	// print(
	// 	'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
	// 	'/nccloud/pu/arrival/dirprintbarcode.do', //后台服务url
	// 	{
	// 		billtype: '23', //单据类型
	// 		funcode: '400401200', //功能节点编码，即模板编码
	// 		nodekey: null, //模板节点标识
	// 		oids: [ id ] // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
	// 		// 打印按钮不用传该参数,输出按钮(文件下载)需加参数outputType,值为output。
	// 	}
	// );
	let selectedRows = this.props.cardTable.getCheckedRows(AREA.body);
	let bodylength = selectedRows.length;
	let bidpks = [];
	let materialinfo = {};
	if (selectedRows.length > 0) {
		for (var i = 0; i < bodylength; i++) {
			bidpks.push(selectedRows[i].data.values.pk_arriveorder_b.value);
		}
	}
	codeNfig(this.props, { data: materialinfo, directPrinter: true }, (info) => {
		let userjson =
			BILLTYPE.arrival + //单据类型
			',' +
			info.width + //宽度
			',' +
			info.height + //高度
			',' +
			info.direction + //纸张方向
			',' +
			info.leftMargin + //左边距
			',' +
			info.rightMargin + //右边距
			',' +
			info.topMargin + //上边距
			',' +
			info.bottomMargin + //下边距
			',' +
			info.dataColumn +
			',' +
			bidpks;
		print(
			'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			'/nccloud/pu/arrival/dirprintbarcode.do', //后台服务url
			{
				userjson: userjson, //单据类型

				oids: [ id ] // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
			},
			false
		);
	});
}
