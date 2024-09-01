/*
 * @Author: jiangfw 
 * @PageInfo: 委外收票拉单全部页签查询
 * @Date: 2018-06-10 19:21:21 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 15:25:55
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, URL, BILLTYPE, PK, KEYMAP, COMMON } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import translateData from '../../utils/translateData';
import { deepClone } from '../../utils/deepClone';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function clickSerachBtn(queryInfo, isRefresh) {
	let queryInfos = new Array();

	let queryInfo61;
	let queryInfo47;
	if (queryInfo) {
		queryInfo61 = deepClone(queryInfo);
		queryInfo47 = deepClone(queryInfo);
	} else {
		let transType = this.transType;
		queryInfo61 = this.props.search.getQueryInfo(AREA.searchAll);
		queryInfo61.userdefObj = { transType: transType };
		// 将查询条件缓存
		setDefData(COMMON.TransferCacheKey, AREA.searchAll, queryInfo61);
		if (queryInfo61 && !queryInfo61.querycondition) return;
		queryInfo47 = this.props.search.getQueryInfo(AREA.searchAll);
		queryInfo47.userdefObj = { transType: transType };
	}

	queryInfo61.oid = this.qTempletid_61;
	queryInfo47.oid = this.qTempletid_47;

	let info61 = {
		queryInfo: queryInfo61,
		pageCode: PAGECODE.ref61_list, //页面编码
		templetid: this.templetid_61 //模板ID
	};
	let info47 = {
		queryInfo: queryInfo47,
		pageCode: PAGECODE.ref47_list, //页面编码
		templetid: this.templetid_47 //模板ID
	};

	queryInfos.push(info61);
	queryInfos.push(info47);
	let multidata = {
		queryInfo: queryInfos
	};

	ajax({
		url: URL.refScAllQuery,
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
				let data61 = [];
				let data47 = [];
				for (let d of data) {
					if (PAGECODE.ref61_list == d.pageid) {
						data61.push(d);
					} else if (PAGECODE.ref47_list == d.pageid) {
						data47.push(d);
					}
				}

				//处理结算财务组织
				// let pk_financeorg_v = queryInfo61
				// 处理可收票主数量
				calcNcaninvoicenum(data47, BILLTYPE.subcontIn);
				calcNcaninvoicenum(data61, BILLTYPE.sc_order);

				// 委外订单
				// let m61extatt = { cbilltypeid: { value: BILLTYPE.sc_order, display: BILLTYPE.sc_order_n } };
				let m61extatt = {
					cbilltypeid: {
						value: BILLTYPE.sc_order,
						display: getLangByResId(this, '4004PUINVOICE-000036') /* 国际化处理： 委外订单*/
					}
				};
				let dest61datas = translateData(
					data61,
					AREA.head61,
					AREA.body61,
					AREA.headAll,
					AREA.bodyAll,
					KEYMAP.m61to25,
					m61extatt
				);
				// 表头取表体的值
				destdatas.push(...dest61datas);

				// 委外加工入库单
				// let m47extatt = { cbilltypeid: { value: BILLTYPE.subcontIn, display: BILLTYPE.subcontIn_n } };
				let m47extatt = {
					cbilltypeid: {
						value: BILLTYPE.subcontIn,
						display: getLangByResId(this, '4004PUINVOICE-000037') /* 国际化处理： 委外加工入库单*/
					}
				};
				let dest47datas = translateData(
					data47,
					AREA.head47,
					AREA.body47,
					AREA.headAll,
					AREA.bodyAll,
					KEYMAP.m47to25,
					m47extatt
				);
				destdatas.push(...dest47datas);

				this.props.transferTable.setTransferTableValue(
					AREA.headAll,
					AREA.bodyAll,
					destdatas,
					[ PK.head61pk, PK.head47pk ],
					[ PK.body61pk, PK.body47pk ]
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
 * 计算可收票主数量
 * @param {行数据} bills 
 */
function calcNcaninvoicenum(bills, billtype) {
	if (billtype == BILLTYPE.sc_order) {
		bills.forEach((bill) => {
			let bodys = bill.body.body61.rows;
			bodys.forEach((body) => {
				// 可收票主数量	= 委外订单主数量-累计收票主数量（累计开票主数量）
				let naccuminvoicenum = (body.values.naccuminvoicenum && body.values.naccuminvoicenum.value) || 0;
				let scale = body.values.naccuminvoicenum.scale;
				let ncaninvoicenum = body.values.nnum.value - naccuminvoicenum;
				body.values.ncaninvoicenum = { value: ncaninvoicenum, scale };
			});
		});
	} else {
		bills.forEach((bill) => {
			let bodys = bill.body.body47.rows;
			bodys.forEach((body) => {
				// 可收票主数量 = 委托加工入库单实收主数量-累计收票主数量（累计开票主数量）
				let nsignnum = (body.values.nsignnum && body.values.nsignnum.value) || 0;
				let scale = body.values.nsignnum.scale;
				let ncaninvoicenum = body.values.nnum.value - nsignnum;
				body.values.ninvoicenum = { value: ncaninvoicenum, scale };
			});
		});
	}
}
