/*
 * @Author: CongKe 
 * @PageInfo: 采购订单拉采购合同查询
 * @Date: 2018-06-13 14:13:15 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 15:00:07
 */
import { ajax, toast } from 'nc-lightapp-front';
import { TRANSFERZ2, PAGECODE, OrderCache } from '../../constance';
import { clearTransferCache, setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

//点击查询，获取查询区数据
export default function(props, isRefresh) {
	let _this = this;
	let queryInfo = this.props.search.getQueryInfo(TRANSFERZ2.SEARCHID);
	if (queryInfo.querycondition) {
		let org = queryInfo.querycondition.conditions[0] && queryInfo.querycondition.conditions[0].value.firstvalue;
		setDefData(OrderCache.OrderCacheKey, 'z2org', {
			org: org
		});
		let transtype = getDefData(OrderCache.OrderCardCache, 'transtype');
		let data = {
			templetid: this.state.templetid,
			queryInfo: queryInfo,
			pageCode: TRANSFERZ2.PAGEID, //页面编码
			userobj: { billtype_qs_key: transtype }
		};
		//得到数据渲染到页面
		ajax({
			url: TRANSFERZ2.GETQUERYDATA,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				let backdata = [];
				let content = null; // getLangByResId(_this, '4004POORDER-000085'); /* 国际化处理： 查询结果为空！*/
				if (res.data) {
					backdata = res.data;
					content = backdata.length; //getLangByResId(_this, '4004POORDER-000006'); /* 国际化处理： 查询成功！*/
					clearTransferCache(_this.props, OrderCache.OrderTransferCache);
				}
				_this.props.transferTable.setTransferTableValue(
					TRANSFERZ2.LIST_TABLE,
					TRANSFERZ2.LIST_TABLE_CHILD,
					backdata,
					'pk_ct_pu',
					'pk_ct_pu_b'
				);
				// toast({color: 'success',content: content});
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(content);
			}
		});
	}
}
