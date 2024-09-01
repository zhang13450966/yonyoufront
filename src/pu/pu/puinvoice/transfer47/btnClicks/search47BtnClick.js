/*
 * @Author: jiangfw
 * @PageInfo: 委外加工入库单拉单查询
 * @Date: 2018-06-10 19:21:21
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-11 09:24:29
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PK, URL, PAGECODE } from '../../constance';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(isRefresh) {
	let pageInfo = {
		pageSize: 0,
		pageIndex: 0
	};

	let queryInfo = this.props.search.getQueryInfo(AREA.search47);
	queryInfo.userdefObj = { transType: this.transType, pk_busitype: this.pk_busitype };
	if (queryInfo && !queryInfo.querycondition) return;

	let map = new Map();
	let pks = new Array();
	if (this.refsourcdata && this.refsourcdata.transferInfo) {
		this.refsourcdata.transferInfo.forEach((o) => {
			if (o.data && o.data.length > 0) {
				o.data.forEach((e) => {
					if (e.bodys && e.bodys.length > 0) {
						e.bodys.forEach((body) => {
							pks = map.get('cgeneralbid');
							pks = pks == null ? new Array() : pks;
							pks.push(body.pk);
							map.set('cgeneralbid', pks);
						});
					}
				});
			}
		});
	}
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref47_list, //页面编码
		templetid: this.templetid_47, //模板id
		userobj: map
	};

	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.ref47Query,
		data: data,
		success: (res) => {
			let { success, data } = res;
			if (success && data && data.length > 0) {
				// 执行公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				_this.props.transferTable.setTransferTableValue(
					AREA.head47,
					AREA.body47,
					data,
					PK.head47pk,
					PK.body47pk
				);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				_this.props.transferTable.setTransferTableValue(AREA.head47, []);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage();
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
