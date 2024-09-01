/*
 * @Author: jiangfw 
 * @PageInfo: 采购入库单收票查询
 * @Date: 2018-06-10 19:21:21 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-06-28 13:28:13
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE, PK, APPCODE } from '../../constance';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(isRefresh) {
	let pageInfo = {
		pageSize: 0,
		pageIndex: 0
	};

	let queryInfo = this.props.search.getQueryInfo(AREA.search45);
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
		pageCode: PAGECODE.ref45_list, //页面编码
		appcode: APPCODE.purchaseIn, //应用编码
		templetid: this.templetid_45, //模板id
		userobj: map
	};

	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.ref45Query,
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
					AREA.head45,
					AREA.body45,
					data,
					PK.head45pk,
					PK.body45pk
				);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				_this.props.transferTable.setTransferTableValue(AREA.head45, []);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage();
			}
		}
	});
}
