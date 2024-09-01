/*
 * @Author: jiangfw 
 * @PageInfo: 采购订单收票查询
 * @Date: 2018-06-10 19:21:21 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-04-13 13:17:18
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, URL, PK, APPCODE, COMMON } from '../../constance';
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
		queryInfo = this.props.search.getQueryInfo(AREA.search21);
		let transType = this.transType;
		queryInfo.userdefObj = { transType: transType };
		// 将查询条件缓存
		setDefData(COMMON.TransferCacheKey, AREA.search21, queryInfo);
		if (queryInfo && !queryInfo.querycondition) return;
	}
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref21_list, //页面编码
		appcode: APPCODE.poorder, //应用编码
		templetid: this.templetid_21 //模板id
	};

	// 可收票数量、可收票金额清0
	// this.setState({
	// 	ntotalnum: 0,
	// 	ntotalmny: 0
	// });

	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.ref21Query,
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
					AREA.head21,
					AREA.body21,
					data,
					PK.head21pk,
					PK.body21pk
				);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				_this.props.transferTable.setTransferTableValue(AREA.head21, []);
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
}
