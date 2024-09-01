/*
 * @Author: jiangfw 
 * @PageInfo: 查看已选
 * @Date: 2018-08-04 12:28:16 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-04 13:21:54
 */
import translateData from '../../utils/translateData';
import { AREA, KEYMAP, BILLTYPE, PK } from '../../constance';

export default function select(data) {
	let selectdata = this.props.transferTable.getTransferTableSelectedValue();
	// 转换为全部模板需要的数据
	let destdatas = [];

	// 采购订单
	let m21extatt = { cbilltypeid: { value: BILLTYPE.po_order, display: BILLTYPE.po_order_n } };
	// let m21headbody = { csettleorgid: 'csettleorgvid' };
	let dest21datas = translateData(
		selectdata[AREA.head21],
		AREA.head21,
		AREA.body21,
		AREA.headAll,
		AREA.bodyAll,
		KEYMAP.m21to25,
		m21extatt
	);
	// 处理表头取订单表体结算财务组织，出库表体开票客户
	destdatas.push(...dest21datas);

	// 采购入库单
	let m45extatt = { cbilltypeid: { value: BILLTYPE.purchaseIn, display: BILLTYPE.purchaseIn_n } };
	let dest45datas = translateData(
		selectdata[AREA.head45],
		AREA.head45,
		AREA.body45,
		AREA.headAll,
		AREA.bodyAll,
		KEYMAP.m45to25,
		m45extatt
	);
	destdatas.push(...dest45datas);

	// 期初暂估单
	let m4Textatt = { cbilltypeid: { value: BILLTYPE.initEstimate, display: BILLTYPE.initEstimate_n } };
	let dest4Tdatas = translateData(
		selectdata[AREA.head4T],
		AREA.head4T,
		AREA.body4T,
		AREA.headAll,
		AREA.bodyAll,
		KEYMAP.m4Tto25,
		m4Textatt
	);
	destdatas.push(...dest4Tdatas);

	if (selectdata[AREA.headAll]) {
		destdatas.push(...selectdata[AREA.headAll]);
	}

	//点击已选列表的钩子函数
	this.props.transferTable.setMultiSelectedValue(
		AREA.headAll,
		AREA.bodyAll,
		destdatas,
		[ PK.head21pk, PK.head45pk, PK.head4Tpk ],
		[ PK.body21pk, PK.body45pk, PK.body4Tpk ]
	);
}
