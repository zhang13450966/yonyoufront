/*
 * @Author: jiangfw
 * @PageInfo: 委外订单收票查询
 * @Date: 2018-06-10 19:21:21
 * @Last Modified by: zhr
 * @Last Modified time: 2020-06-24 17:20:19
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, URL, PK } from '../../constance';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(isRefresh) {
	let pageInfo = {
		pageSize: 0,
		pageIndex: 0
	};

	let queryInfo = this.props.search.getQueryInfo(this.queryArea);
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
							pks = map.get('pk_order_b');
							pks = pks == null ? new Array() : pks;
							pks.push(body.pk);
							map.set('pk_order_b', pks);
						});
					}
				});
			}
		});
	}
	let transType = this.transType;
	queryInfo.userdefObj = { transType: transType };
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref61_list, //页面编码
		templetid: this.templetid_61, //模板id
		userobj: map
	};

	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.ref61Query,
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
					AREA.head61,
					AREA.body61,
					data,
					PK.head61pk,
					PK.body61pk
				);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				_this.props.transferTable.setTransferTableValue(AREA.head61, []);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage();
			}
		}
	});
}
