/*
 * @Author: jiangfw 
 * @PageInfo: 委外加工入库单拉单查询
 * @Date: 2018-06-10 19:21:21 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-01-20 14:59:10
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PK, URL, PAGECODE, COMMON } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showQueryResultInfoForNoPage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(queryInfo_I,isRefresh) {
	let pageInfo = {
		pageSize: 0,
		pageIndex: 0
	};

	let queryInfo;
	if (queryInfo_I) {
		queryInfo = queryInfo_I;
	} else {
		queryInfo = this.props.search.getQueryInfo(AREA.search47);
		let transType = this.transType;

		queryInfo.userdefObj = { transType: transType };
		// 将查询条件缓存
		setDefData(COMMON.TransferCacheKey, AREA.search47, queryInfo);
		if (queryInfo && !queryInfo.querycondition) return;
	}
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref47_list, //页面编码
		templetid: this.templetid_47 //模板id
	};

	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.ref47Query,
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
				calcRemainNum(data);
				_this.props.transferTable.setTransferTableValue(
					AREA.head47,
					AREA.body47,
					data,
					PK.head47pk,
					PK.body47pk
				);
				isRefresh ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				_this.props.transferTable.setTransferTableValue(AREA.head47, []);
				isRefresh ? showRefreshInfo() : showQueryResultInfoForNoPage();
			}
		}
	});
}

/**
 * 计算可收票主数量
 * @param {行数据} bills 
 */
function calcRemainNum(bills) {
	bills.forEach((bill) => {
		let bodys = bill.body.body47.rows;
		bodys.forEach((body) => {
			// 可收票主数量 = 委托加工入库单实收主数量-累计收票主数量（累计开票主数量）
			let nsignnum = (body.values.nsignnum && body.values.nsignnum.value) || 0;
			let scale = body.values.nsignnum.scale;
			let ninvoicenum = body.values.nnum.value - nsignnum;
			body.values.ninvoicenum = { value: ninvoicenum, scale };
		});
	});
}
