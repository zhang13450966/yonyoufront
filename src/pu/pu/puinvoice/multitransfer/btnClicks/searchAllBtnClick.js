/*
 * @Author: jiangfw 
 * @PageInfo: 采购发票收票拉单全部页签查询
 * @Date: 2018-06-10 19:21:21 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-04-13 13:23:26
 */
import { ajax } from 'nc-lightapp-front';
import translateData from '../../utils/translateData';
import { AREA, PAGECODE, URL, BILLTYPE, KEYMAP, PK, COMMON } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { deepClone } from '../../utils/deepClone';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function clickSerachBtn(queryInfo, isRefresh) {
	let queryInfos = new Array();

	let queryInfo21;
	let queryInfo45;
	let queryInfo4T;
	if (queryInfo) {
		queryInfo21 = deepClone(queryInfo);
		queryInfo45 = deepClone(queryInfo);
		queryInfo4T = deepClone(queryInfo);
	} else {
		let transType = this.transType;

		queryInfo21 = this.props.search.getQueryInfo(AREA.searchAll);
		queryInfo21.userdefObj = { transType: transType };
		setDefData(COMMON.TransferCacheKey, AREA.searchAll, queryInfo21);
		if (queryInfo21 && !queryInfo21.querycondition) return;
		queryInfo45 = this.props.search.getQueryInfo(AREA.searchAll);
		queryInfo45.userdefObj = { transType: transType };
		queryInfo4T = this.props.search.getQueryInfo(AREA.searchAll);
		queryInfo4T.userdefObj = { transType: transType };
	}

	queryInfo21.oid = this.qTempletid_21;
	queryInfo45.oid = this.qTempletid_45;
	queryInfo4T.oid = this.qTempletid_4T;

	let info21 = {
		queryInfo: queryInfo21,
		pageCode: PAGECODE.ref21_list, //页面编码
		templetid: this.templetid_21 //模板ID
	};
	let info45 = {
		queryInfo: queryInfo45,
		pageCode: PAGECODE.ref45_list, //页面编码
		templetid: this.templetid_45 //模板ID
	};
	let info4T = {
		queryInfo: queryInfo4T,
		pageCode: PAGECODE.ref4T_list, //页面编码
		templetid: this.templetid_4T //模板ID
	};

	queryInfos.push(info21);
	queryInfos.push(info45);
	queryInfos.push(info4T);
	let multidata = {
		queryInfo: queryInfos
	};

	// 可收票数量、可收票金额清0
	// this.setState({
	// 	ntotalnum: 0,
	// 	ntotalmny: 0
	// });

	ajax({
		url: URL.refAllQuery,
		data: multidata,
		success: (res) => {
			let { success, data } = res;
			// if (success) {
			// 	this.setState({
			// 		ntotalnum: 0,
			// 		ntotalmny: 0
			// 	});
			// }

			if (success && data && data.length > 0) {
				// 执行公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}

				let destdatas = [];
				let data21 = [];
				let data45 = [];
				let data4T = [];
				for (let d of data) {
					if (PAGECODE.ref21_list == d.pageid) {
						data21.push(d);
					} else if (PAGECODE.ref45_list == d.pageid) {
						data45.push(d);
					} else if (PAGECODE.ref4T_list == d.pageid) {
						data4T.push(d);
					}
				}

				// 计算可收票金额
				calcNcaninvoicemny(data21, BILLTYPE.po_order);
				calcNcaninvoicemny(data4T, BILLTYPE.initEstimate);

				// 采购订单
				// let m21extatt = { cbilltypeid: { value: BILLTYPE.po_order, display: BILLTYPE.po_order_n } };
				let m21extatt = {
					cbilltypeid: {
						value: BILLTYPE.po_order,
						display: getLangByResId(this, '4004PUINVOICE-000033') /* 国际化处理： 采购订单*/
					}
				};
				let dest21datas = translateData(
					data21,
					AREA.head21,
					AREA.body21,
					AREA.headAll,
					AREA.bodyAll,
					KEYMAP.m21to25,
					m21extatt
				);
				// 表头取表体的值，biao'ti
				destdatas.push(...dest21datas);

				// 采购入库单
				// let m45extatt = { cbilltypeid: { value: BILLTYPE.purchaseIn, display: BILLTYPE.purchaseIn_n } };
				let m45extatt = {
					cbilltypeid: {
						value: BILLTYPE.purchaseIn,
						display: getLangByResId(this, '4004PUINVOICE-000034') /* 国际化处理： 采购入库单*/
					}
				};
				let dest45datas = translateData(
					data45,
					AREA.head45,
					AREA.body45,
					AREA.headAll,
					AREA.bodyAll,
					KEYMAP.m45to25,
					m45extatt
				);
				destdatas.push(...dest45datas);

				// 期初暂估单
				// let m4Textatt = { cbilltypeid: { value: BILLTYPE.initEstimate, display: BILLTYPE.initEstimate_n } };
				let m4Textatt = {
					cbilltypeid: {
						value: BILLTYPE.initEstimate,
						display: getLangByResId(this, '4004PUINVOICE-000035') /* 国际化处理： 期初暂估单*/
					}
				};
				let dest4Tdatas = translateData(
					data4T,
					AREA.head4T,
					AREA.body4T,
					AREA.headAll,
					AREA.bodyAll,
					KEYMAP.m4Tto25,
					m4Textatt
				);
				destdatas.push(...dest4Tdatas);

				this.props.transferTable.setTransferTableValue(
					AREA.headAll,
					AREA.bodyAll,
					destdatas,
					[ PK.head21pk, PK.head45pk, PK.head4Tpk ],
					[ PK.body21pk, PK.body45pk, PK.body4Tpk ]
				);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				this.props.transferTable.setTransferTableValue(
					AREA.headAll,
					AREA.bodyAll,
					[],
					[ PK.head61pk, PK.head47pk ],
					[ PK.body61pk, PK.body47pk ]
				);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage();
			}
		}
	});
}

/**
 * 计算可收票金额
 * @param {行数据} bills 
 */
function calcNcaninvoicemny(bills, billtype) {
	if (billtype == BILLTYPE.po_order) {
		bills.forEach((bill) => {
			let bodys = bill.body.body21.rows;
			bodys.forEach((body) => {
				// 可收票金额 = 总价税合计 - 含税单价*累计开票数量
				// let ncaninvoicenum = (body.values.ncaninvoicenum && body.values.ncaninvoicenum.value) || 0;
				let naccuminvoicenum = (body.values.naccuminvoicenum && body.values.naccuminvoicenum.value) || 0;

				let scale = body.values.norigtaxmny.scale;
				// let ncaninvoicemny = body.values.nqtorigtaxprice.value * ncaninvoicenum;
				let ncaninvoicemny = body.values.norigtaxmny.value - body.values.norigtaxprice.value * naccuminvoicenum;
				ncaninvoicemny = ncaninvoicemny.toFixed(2);
				body.values.ncaninvoicemny = { value: ncaninvoicemny, scale: scale };
			});
		});
	} else if (billtype == BILLTYPE.initEstimate) {
		bills.forEach((bill) => {
			let bodys = bill.body.body4T.rows;
			bodys.forEach((body) => {
				// 可收票金额 = 总价税合计 - 含税单价*累计开票数量
				// let ncaninvoicenum = (body.values.ncaninvoicenum && body.values.ncaninvoicenum.value) || 0;
				let naccinvoicenum = (body.values.naccinvoicenum && body.values.naccinvoicenum.value) || 0;

				let scale = body.values.norigtaxmny.scale;
				// let ncaninvoicemny = body.values.nastorigtaxprice.value * ncaninvoicenum;
				let ncaninvoicemny =
					body.values.norigtaxmny.value - body.values.nastorigtaxprice.value * naccinvoicenum;
				ncaninvoicemny = ncaninvoicemny.toFixed(2);
				body.values.ncaninvoicemny = { value: ncaninvoicemny, scale: scale };
			});
		});
	}
}
