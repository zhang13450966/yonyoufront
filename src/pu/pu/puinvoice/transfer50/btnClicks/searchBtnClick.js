/*
 * @Author: jiangfw
 * @PageInfo: 消耗汇总收票查询
 * @Date: 2018-06-10 19:21:21
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-09-21 11:20:18
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE, FIELD, COMMON } from '../../constance';
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
		queryInfo = this.props.search.getQueryInfo(AREA.ref50_query);
		queryInfo.userdefObj = { transType: this.transType, pk_busitype: this.pk_busitype };
		// 将查询条件缓存
		if (!this.isRefAddLine) {
			setDefData(COMMON.TransferCacheKey, AREA.ref50_query, queryInfo);
		}
		if (queryInfo && !queryInfo.querycondition) return;
	}
	let map = {};
	let pks = new Array();
	if (this.refsourcdata && this.refsourcdata.transferInfo) {
		this.refsourcdata.transferInfo.forEach((o) => {
			if (o.data && o.data.length > 0) {
				o.data.forEach((e) => {
					if (e.head) {
						pks = map.cvmihid;
						pks = pks == null ? new Array() : pks;
						pks.push(e.head.pk);
						map = { cvmihid: pks };
					}
				});
			}
		});
	}
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref50_list, //页面编码
		templetid: this.templetid_50, //模板ID
		userobj: map
	};

	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.ref50Query,
		data: data,
		success: (res) => {
			if (res.data && res.data[AREA.ref50_head]) {
				// 执行公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				let rowData = res.data[AREA.ref50_head];
				//处理 可收票主数量
				_this.props.transferTable.setTransferTableValue(
					_this.tableId,
					'',
					rowData,
					// FIELD.cvmibid,
					// FIELD.cvmibid
					FIELD.cvmihid,
					''
				);
				isRefresh == true
					? showRefreshInfo()
					: showQueryResultInfoForNoPage(res.data[AREA.ref50_head].rows.length);
			} else {
				_this.props.transferTable.setTransferTableValue(_this.tableId, '', [], FIELD.cvmihid, '');
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage();
			}
		}
	});
}
