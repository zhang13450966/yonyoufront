/*
 * @Author: CongKe 
 * @PageInfo: 采购订单拉请购单查询
 * @Date: 2018-06-13 14:13:15 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-08-12 11:29:58
 */
import { ajax, toast } from 'nc-lightapp-front';
import { TRANSFER20, PAGECODE, URL, OrderCache, FIELD } from '../../constance';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';

//点击查询，获取查询区数据
export default function(value) {
	let _this = this;
	let _url = TRANSFER20.GETQUERYDATA;
	let queryInfo;
	queryInfo = this.props.search.getQueryInfo(TRANSFER20.SEARCHID, false);
	if (queryInfo.querycondition) {
		let map = new Map();

		// 加上采购订单发布的交易类型
		let transtype = getDefData(OrderCache.OrderCardCache, 'transtype');
		map.set('billtype_qs_key', transtype);
		map.set('value', value);
		let data = {
			templetid: this.state.templetid,
			queryInfo: queryInfo,
			pageCode: TRANSFER20.PAGEID, //页面编码
			userobj: map
		};
		//得到数据渲染到页面
		ajax({
			url: _url,
			data: data,
			success: (res) => {
				let backdata = [];
				let content = null; //getLangByResId(this, '4004POORDER-000098'); /* 国际化处理： 未查询出符合条件的数据*/
				this.setState({ ntotalnum: 0 });
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res && res.data) {
					res.data.map((item) => {
						//计算： 可订货主数量=请购单主数量-累计订货主数量
						//num=nnum-naccumulatenum
						let bodydatas = item.body[TRANSFER20.LIST_TABLE_CHILD].rows;
						bodydatas.map((m) => {
							let nnum = m.values.nnum.value;
							let scale = m.values.nnum.scale;
							let naccumulatenum =
								m.values.naccumulatenum == undefined ? 0 : m.values.naccumulatenum.value;
							let caninnum = nnum - naccumulatenum;
							m.values.num = { value: caninnum, scale: scale };
						});
					});
					let dataSources = OrderCache.OrderTransferCache;
					if (_this.isRefAddLine == true) {
						dataSources = OrderCache.OrderRefAdd20;
					}
					clearTransferCache(_this.props, dataSources);
					backdata = res.data;
					content = res.data.length; //getLangByResId(this, '4004POORDER-000006'); /* 国际化处理： 查询成功！*/
				}
				showQueryResultInfoForNoPage(content);
				this.props.transferTable.setTransferTableValue(
					TRANSFER20.LIST_TABLE,
					TRANSFER20.LIST_TABLE_CHILD,
					backdata,
					'pk_praybill',
					'pk_praybill_b'
				);
			}
		});
	}
}
