/*
 * @Author: jiangfw 
 * @PageInfo: 委外订单收票查询
 * @Date: 2018-06-10 19:21:21 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-11 09:23:56
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, URL, PK, COMMON } from '../../constance';
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
		queryInfo = this.props.search.getQueryInfo(AREA.search61);
		let transType = this.transType;
		queryInfo.userdefObj = { transType: transType };
		// 将查询条件缓存
		setDefData(COMMON.TransferCacheKey, AREA.search61, queryInfo);
		if (queryInfo && !queryInfo.querycondition) return;
	}
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref61_list, //页面编码
		templetid: this.templetid_61 //模板id
	};

	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.ref61Query,
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

				//处理 可收票主数量
				calcNcaninvoicenum(data);
				_this.props.transferTable.setTransferTableValue(
					AREA.head61,
					AREA.body61,
					data,
					PK.head61pk,
					PK.body61pk
				);
				isRefresh ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				_this.props.transferTable.setTransferTableValue(AREA.head61, []);
				isRefresh ? showRefreshInfo() : showQueryResultInfoForNoPage();
			}
		}
	});
}

/**
 * 计算可收票主数量
 * @param {行数据} bills 
 */
function calcNcaninvoicenum(bills) {
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
}
