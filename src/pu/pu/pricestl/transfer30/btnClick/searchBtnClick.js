import { ajax } from 'nc-lightapp-front';
import { TRANSFER30, PAGECODE, URL, OrderCache, FIELD } from '../../constance';
import { clearTransferCache, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showQueryResultInfoForNoPage, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(flag) {
	let _url = TRANSFER30.GETQUERYDATA;
	let queryInfo = this.props.search.getQueryInfo(TRANSFER30.SEARCHID, true);
	if (queryInfo.querycondition) {
		let org = queryInfo.querycondition.conditions[0] && queryInfo.querycondition.conditions[0].value.firstvalue;
		setDefData(OrderCache.OrderCacheKey, TRANSFER30.org, {
			org: org
		});
		let data = {
			templetid: this.state.templetid,
			queryInfo: queryInfo,
			pageCode: TRANSFER30.PAGEID //页面编码
		};
		ajax({
			url: _url,
			data: data,
			success: (res) => {
				let backdata = [];
				let content = null;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res && res.data) {
					clearTransferCache(this.props, OrderCache.OrderTransferCache);
					backdata = res.data;
					content = res.data.length;
				}
				if (flag == 'refresh') {
					showSuccessInfo(getLangByResId(this, '4004PRICESTL-000010'));
				} else {
					showQueryResultInfoForNoPage(content);
				}
				this.props.transferTable.setTransferTableValue(
					TRANSFER30.LIST_TABLE,
					TRANSFER30.LIST_TABLE_CHILD,
					backdata,
					TRANSFER30.Cgeneralhid,
					TRANSFER30.Cgeneralbid
				);
			}
		});
	}
}
