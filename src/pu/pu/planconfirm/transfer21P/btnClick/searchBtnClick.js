/*
 * @Author: CongKe 
 * @PageInfo: 采购订单拉请购单查询
 * @Date: 2018-06-13 14:13:15 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-18 16:57:51
 */
import { ajax } from 'nc-lightapp-front';
import { TRANSFER2C, CONSTFIELD } from '../../constance';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

//点击查询，获取查询区数据
export default function(scene, isRefresh) {
	let _this = this;
	let _url = TRANSFER2C.GETQUERYDATA;
	let queryInfo;
	let tododata;
	clearTransferCache(this.props, CONSTFIELD.PlanconfirmTransferCache);
	queryInfo = this.props.search.getQueryInfo(TRANSFER2C.SEARCHID, true);

	if (queryInfo.querycondition) {
		let map = new Map();
		let pks = new Array();
		if (this.refsourcdata) {
			this.refsourcdata.data.forEach((e) => {
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

		let data = {
			templetid: this.state.templetid,
			queryInfo: queryInfo,
			pageCode: TRANSFER2C.PAGEID, //页面编码
			userobj: map
		};

		//得到数据渲染到页面
		ajax({
			url: _url,
			data: data,
			success: (res) => {
				let backdata = [];
				let content = null;
				this.setState({ ntotalnum: 0, ntotalmny: 0 });
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res && res.data) {
					res.data.map((item) => {
						//计算： 可确认主数量=采购订单付款计划主数量-累计确认主数量
						let bodydatas = item.body[TRANSFER2C.LIST_TABLE_CHILD].rows;
						bodydatas.map((m) => {
							let nallconfirmnum = m.values.nallconfirmnum.value;
							let scale = m.values.nallconfirmnum.scale;
							let naccconfirmnum =
								JSON.stringify(m.values.naccconfirmnum) == '{}' ? 0 : m.values.naccconfirmnum.value;
							let ncanconfirmnnum = nallconfirmnum - naccconfirmnum;
							m.values.ncanconfirmnnum = { value: ncanconfirmnnum, scale: scale };

							// let nmny = m.values.nmny.value;
							// let nmnyscale = m.values.nmny.scale;
							// let naccumconfirmmny =
							// 	JSON.stringify(m.values.naccumconfirmmny) == '{}' ? 0 : m.values.naccumconfirmmny.value;
							// let ncanconfirmnmny = nmny - naccumconfirmmny;
							// m.values.ncanconfirmnmny = { value: ncanconfirmnmny, scale: nmnyscale };
						});
					});
					let dataSources = CONSTFIELD.PlanconfirmTransferCache;
					if (_this.isRefAddLine == true) {
						dataSources = CONSTFIELD.PlanConfirmRefAdd21P;
					}
					clearTransferCache(_this.props, dataSources);
					backdata = res.data;
					content = res.data.length; //getLangByResId(this, '4004POORDER-000006'); /* 国际化处理： 查询成功！*/
				}
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(content);
				this.props.transferTable.setTransferTableValue(
					TRANSFER2C.LIST_TABLE,
					TRANSFER2C.LIST_TABLE_CHILD,
					backdata,
					'pk_order_payplan',
					'pk_order_payplan_b'
				);
			}
		});
	}
}
