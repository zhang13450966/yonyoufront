/*
 * @Author: CongKe 
 * @PageInfo: 采购订单拉借入查询
 * @Date: 2018-06-13 14:13:15 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 14:59:13
 */
import { ajax, toast } from 'nc-lightapp-front';
import { TRANSFER49, PAGECODE, OrderCache } from '../../constance';
import { clearTransferCache, setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

//点击查询，获取查询区数据
export default function(isRefresh) {
	let _this = this;
	let queryInfo = this.props.search.getQueryInfo(TRANSFER49.SEARCHID);
	if (queryInfo.querycondition) {
		let org = queryInfo.querycondition.conditions[0] && queryInfo.querycondition.conditions[0].value.firstvalue;
		let transtype = getDefData(OrderCache.OrderCardCache, 'transtype');
		let data = {
			templetid: this.state.templetid,
			queryInfo: queryInfo,
			pageCode: TRANSFER49.PAGEID, //页面编码
			userobj: { billtype_qs_key: transtype }
		};
		//得到数据渲染到页面
		ajax({
			url: TRANSFER49.GETQUERYDATA,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				let backdata = [];
				let content = null;
				if (res.data) {
					backdata = res.data;
					content = backdata.length;
					clearTransferCache(_this.props, OrderCache.OrderTransferCache);
				}
				_this.props.transferTable.setTransferTableValue(
					TRANSFER49.LIST_TABLE,
					TRANSFER49.LIST_TABLE_CHILD,
					backdata,
					'cgeneralhid',
					'cgeneralbid'
				);
				isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(content);
			}
		});
	}
}
