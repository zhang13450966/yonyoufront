/*
 * @Author: jiangfw 
 * @PageInfo: 期初暂估单收票查询
 * @Date: 2018-06-10 19:21:21 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-06-28 13:24:41
 */
import { ajax } from 'nc-lightapp-front';
import { APPCODE, AREA, URL, PAGECODE, PK } from '../../constance';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(isRefresh) {
	let pageInfo = {
		pageSize: 0,
		pageIndex: 0
	};

	let queryInfo = this.props.search.getQueryInfo(AREA.search4T);
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
							pks = map.get('pk_initialest_b');
							pks = pks == null ? new Array() : pks;
							pks.push(body.pk);
							map.set('pk_initialest_b', pks);
						});
					}
				});
			}
		});
	}

	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref4T_list, //页面编码
		appcode: APPCODE.initialest, //应用编码
		templetid: this.templetid_4T, //模板id
		userobj: map
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
