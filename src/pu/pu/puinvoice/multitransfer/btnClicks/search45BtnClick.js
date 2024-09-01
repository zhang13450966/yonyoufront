/*
 * @Author: jiangfw 
 * @PageInfo: 采购入库单收票查询
 * @Date: 2018-06-10 19:21:21 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 15:21:26
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE, PK, APPCODE, COMMON } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(queryInfo_I, isRrefresh) {
	let pageInfo = {
		pageSize: 0,
		pageIndex: 0
	};

	let queryInfo;
	if (queryInfo_I) {
		queryInfo = queryInfo_I;
	} else {
		queryInfo = this.props.search.getQueryInfo(AREA.search45);
		let transType = this.transType;
		queryInfo.userdefObj = { transType: transType };
		// 将查询条件缓存
		setDefData(COMMON.TransferCacheKey, AREA.search45, queryInfo);
		if (queryInfo && !queryInfo.querycondition) return;
	}
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref45_list, //页面编码
		appcode: APPCODE.purchaseIn, //应用编码
		templetid: this.templetid_45 //模板id
	};

	// 可收票数量、可收票金额清0
	// this.setState({
	// 	ntotalnum: 0,
	// 	ntotalmny: 0
	// });

	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.ref45Query,
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
				_this.props.transferTable.setTransferTableValue(
					AREA.head45,
					AREA.body45,
					data,
					PK.head45pk,
					PK.body45pk
				);
				isRrefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				_this.props.transferTable.setTransferTableValue(AREA.head45, []);
				isRrefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage();
			}
		}
	});
}
