/*
 * @Author: jiangfw 
 * @PageInfo: 期初暂估单收票查询
 * @Date: 2018-06-10 19:21:21 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 15:23:11
 */
import { ajax } from 'nc-lightapp-front';
import { APPCODE, AREA, URL, PAGECODE, PK, COMMON } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(queryInfo_I, isRefresh) {
	let pageInfo = {
		pageSize: 0,
		pageIndex: 0
	};

	let queryInfo;
	if (queryInfo_I) {
		queryInfo = queryInfo_I;
	} else {
		queryInfo = this.props.search.getQueryInfo(AREA.search4T);
		let transType = this.transType;
		queryInfo.userdefObj = { transType: transType };
		// 将查询条件缓存
		setDefData(COMMON.TransferCacheKey, AREA.search4T, queryInfo);
		if (queryInfo && !queryInfo.querycondition) return;
	}
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref4T_list, //页面编码
		appcode: APPCODE.initialest, //应用编码
		templetid: this.templetid_4T //模板id
	};

	// 可收票数量、可收票金额清0
	// this.setState({
	// 	ntotalnum: 0,
	// 	ntotalmny: 0
	// });

	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.ref4TQuery,
		data: data,
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

				//处理 可收票金额
				calcNcaninvoicemny(data);
				_this.props.transferTable.setTransferTableValue(
					AREA.head4T,
					AREA.body4T,
					data,
					PK.head4Tpk,
					PK.body4Tpk
				);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				_this.props.transferTable.setTransferTableValue(AREA.head4T, []);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage();
			}
		}
	});
}

/**
 * 计算可收票金额
 * @param {行数据} bills 
 */
function calcNcaninvoicemny(bills) {
	bills.forEach((bill) => {
		let bodys = bill.body.body4T.rows;
		bodys.forEach((body) => {
			// 可收票金额 = 总价税合计 - 含税单价*累计开票数量
			let naccinvoicenum = (body.values.naccinvoicenum && body.values.naccinvoicenum.value) || 0;

			let scale = body.values.norigtaxmny.scale;
			let ncaninvoicemny = body.values.norigtaxmny.value - body.values.nastorigtaxprice.value * naccinvoicenum;
			ncaninvoicemny = ncaninvoicemny.toFixed(2);
			body.values.ncaninvoicemny = { value: ncaninvoicemny, scale: scale };
		});
	});
}
