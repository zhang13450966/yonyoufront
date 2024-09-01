/*
 * @Author: jiangfw 
 * @PageInfo: 查看已选
 * @Date: 2018-08-04 12:28:16 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-04 13:21:00
 */
import { AREA, KEYMAP, BILLTYPE, PK } from '../../constance';
import translateData from '../../utils/translateData';

export default function select(data) {
	let selectdata = this.props.transferTable.getTransferTableSelectedValue();
	// 转换为全部模板需要的数据
	let destdatas = [];

	// 委外订单
	let m61extatt = { cbilltypeid: { value: BILLTYPE.sc_order, display: BILLTYPE.sc_order_n } };
	let dest61datas = translateData(
		selectdata[AREA.head61],
		AREA.head61,
		AREA.body61,
		AREA.headAll,
		AREA.bodyAll,
		KEYMAP.m61to25,
		m61extatt
	);
	// 处理表头取订单表体结算财务组织，出库表体开票客户
	destdatas.push(...dest61datas);

	// 委托加工入库单
	let m47extatt = { cbilltypeid: { value: BILLTYPE.subcontIn, display: BILLTYPE.subcontIn_n } };
	let dest47datas = translateData(
		selectdata[AREA.head47],
		AREA.head47,
		AREA.body47,
		AREA.headAll,
		AREA.bodyAll,
		KEYMAP.m47to25,
		m47extatt
	);
	destdatas.push(...dest47datas);

	if (selectdata[AREA.headAll]) {
		destdatas.push(...selectdata[AREA.headAll]);
	}

	//点击已选列表的钩子函数
	this.props.transferTable.setMultiSelectedValue(
		AREA.headAll,
		AREA.bodyAll,
		destdatas,
		[ PK.head61pk, PK.head47pk ],
		[ PK.body61pk, PK.body47pk ]
	);
}
