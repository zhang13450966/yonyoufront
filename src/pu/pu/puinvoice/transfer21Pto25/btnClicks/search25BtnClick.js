/*
 * @Author: jiangfw
 * @PageInfo: 采购订单收票查询
 * @Date: 2018-06-10 19:21:21
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-26 13:35:34
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, URL, PK, APPCODE } from '../../constance';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(isRefresh) {
	let pageInfo = {
		pageSize: 0,
		pageIndex: 0
	};
	let type = this.props.getUrlParam('transType');
	let queryInfo = this.props.search.getQueryInfo(AREA.search25);
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
							pks = map.get('pk_order_payplan_b');
							pks = pks == null ? new Array() : pks;
							pks.push(body.pk);
							map.set('pk_order_payplan_b', pks);
						});
					}
				});
			}
		});
	}
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref25_list, //页面编码
		appcode: APPCODE.poorder21P, //应用编码
		templetid: this.templetid_21P, //模板id
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
		url: URL.ref21Pto25Query,
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
				// calcNcaninvoicemny(data);
				_this.props.transferTable.setTransferTableValue(
					AREA.head25,
					AREA.body25,
					data,
					PK.head25pk,
					PK.body25pk
				);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(data.length);
			} else {
				_this.props.transferTable.setTransferTableValue(AREA.head25, []);
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
		let bodys = bill.body.body25.rows;
		bodys.forEach((body) => {
			//可收票主数量ncaninvoicenum=付款计划子表累计确认主数量 naccumconfirmnum -累计开票主数量 naccuminvoicenum
			// 可收票金额 ncaninvoicemny =付款计划子表累计确认金额 naccumconfirmorgmny-累计开票金额 naccuminvoiceorgmny
			let naccumconfirmnum = body.values.naccumconfirmnum == undefined ? 0 : body.values.naccumconfirmnum.value;
			let naccuminvoicenum = body.values.naccuminvoicenum == undefined ? 0 : body.values.naccuminvoicenum.value;

			let naccumconfirmorgmny =
				body.values.naccumconfirmorgmny == undefined ? 0 : body.values.naccumconfirmorgmny.value;
			let naccuminvoiceorgmny =
				body.values.naccuminvoiceorgmny == undefined ? 0 : body.values.naccuminvoiceorgmny.value;

			let scale = body.values.naccumconfirmnum.scale;
			let ncaninvoicenum = naccumconfirmnum - naccuminvoicenum;
			ncaninvoicenum = ncaninvoicenum.toFixed(2);
			body.values.ncaninvoicenum = { value: ncaninvoicenum, scale: scale };
		});
	});
}
