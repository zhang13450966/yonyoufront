import { print, ajax } from 'nc-lightapp-front';
// import codeNfig from '../../../../../uap/commmon/components/codeConfigModal';
import codeNfig from 'uap/common/components/codeConfigModal';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { AREA, BILLTYPE } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function(props, params) {
	let materialinfo = {};
	let headdata = props.form.getFormItemsValue(AREA.head, [ 'pk_org', 'pk_group', 'pk_arriveorder' ]);

	//没有选中数据
	let unSelectedRows = props.cardTable.getVisibleRows(AREA.body);
	if (unSelectedRows.length == 1) {
		materialinfo = {
			pk_org: headdata[0].value,
			nnum: parseFloat(unSelectedRows[0].values.nnum.value),
			nassistnum: parseFloat(unSelectedRows[0].values.nastnum.value),
			pk_group: headdata[1].value,
			cmaterialvid: unSelectedRows[0].values.pk_material.value
		};
	} else {
		materialinfo = {};
	}

	// 获取选中行
	let flag = true;
	let selectedRows = props.cardTable.getCheckedRows(AREA.body);
	let bodylength = selectedRows.length;
	let bidpks = [];
	//有选中数据
	if (selectedRows.length > 0) {
		for (var i = 0; i < bodylength; i++) {
			bidpks.push(selectedRows[i].data.values.pk_arriveorder_b.value);
			if (selectedRows[0].data.values.pk_material.value != selectedRows[i].data.values.pk_material.value) {
				flag = false;
			}
		}
		if (!flag) {
			materialinfo = {};
		}
		if (selectedRows.length == 1) {
			materialinfo = {
				pk_org: headdata[0].value,
				nnum: parseFloat(selectedRows[0].data.values.nnum.value),
				nassistnum: parseFloat(selectedRows[0].data.values.nastnum.value),
				pk_group: headdata[1].value,
				cmaterialvid: selectedRows[0].data.values.pk_material.value
			};
		}
	} else {
		showWarningInfo(getLangByResId(this, '4004ARRIVAL-000007'));
		return;
	}

	codeNfig(props, { data: materialinfo }, (info) => {
		// let userjson =
		// 	BILLTYPE.arrival + ',' + info.barcodeRule + ',' + info.barcodeLabel + ',' + info.iprintcount + ',' + bidpks;
		let userjson =
			BILLTYPE.arrival + //单据类型
			',' +
			info.barcodeRule + //条码规则
			',' +
			info.barcodeLabel + //条码标签
			',' +
			info.iprintcount + //打印次数
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
			bidpks; //分栏

		if (info.bshowprintlist) {
			const data = {
				billType: BILLTYPE.arrival, //单据类型
				cbillid: headdata[2].value, //主表主键
				cbillbids: bidpks, //子表主键（数组)
				barcodeRule: info.barcodeRule,
				barcodeLabel: info.barcodeLabel,
				iprintcount: info.iprintcount,
				classRoute: 'nccloud.web.pu.arrival.service.BCprintVOBuildServiceImpl' //实现类的全路径
			};
			props.openTo('/bc/bc/bcprint/main/index.html#/list', {
				data: JSON.stringify(data),
				type: 'source',
				appcode: '401700410',
				pagecode: '401700410_list'
			});
		} else {
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				'/nccloud/pu/arrival/printbarcode.do',
				{
					userjson, //单据类型

					oids: [ headdata[2].value ] // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				},
				false
			);
		}
	});
}
