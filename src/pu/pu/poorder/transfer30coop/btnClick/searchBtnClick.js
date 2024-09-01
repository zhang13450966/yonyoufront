/*
 * @Author: CongKe 
 * @PageInfo: 采购订单拉协同销售单查询
 * @Date: 2018-06-13 14:13:15 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 14:55:19
 */
import { ajax, toast } from 'nc-lightapp-front';
import { TRANSFER30TO21COOP, PAGECODE, OrderCache } from '../../constance';
import { clearTransferCache, setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

//点击查询，获取查询区数据
export default function(props, isRefresh) {
	let _this = this;
	let queryInfo = this.props.search.getQueryInfo(TRANSFER30TO21COOP.SEARCHID);
	if (queryInfo.querycondition) {
		let org = queryInfo.querycondition.conditions[0] && queryInfo.querycondition.conditions[0].value.firstvalue;
		setDefData.call(this, OrderCache.OrderCacheKey, 'coop', {
			org: org
		});
		let transtype = getDefData(OrderCache.OrderCardCache, 'transtype');
		let data = {
			templetid: this.state.templetid,
			queryInfo: queryInfo,
			pageCode: TRANSFER30TO21COOP.PAGEID, //页面编码
			userobj: { billtype_qs_key: transtype }
		};
		//得到数据渲染到页面
		ajax({
			url: TRANSFER30TO21COOP.GETQUERYDATA,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				let backdata = [];
				let content = null; // getLangByResId(this, '4004POORDER-000085'); /* 国际化处理： 查询结果为空！*/
				if (res.data) {
					clearTransferCache(_this.props, OrderCache.OrderTransferCache);
					backdata = res.data;
					content = backdata.length; // getLangByResId(this, '4004POORDER-000006'); /* 国际化处理： 查询成功！*/
				}
				_this.props.transferTable.setTransferTableValue(
					TRANSFER30TO21COOP.LIST_TABLE,
					TRANSFER30TO21COOP.LIST_TABLE_CHILD,
					backdata,
					'csaleorderid',
					'csaleorderbid'
				);
				// toast({ color: 'success', content: content });
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(content);
			}
		});
	}
}
