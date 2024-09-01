/*
 * @Author: raoczh 
 * @PageInfo: 拉单查询按钮处理方法
 * @Date: 2018-06-11 19:35:00 
 * @Last Modified by: zhr
 * @Last Modified time: 2019-11-28 19:21:29
 */
import { PAGECODE, PAGEAREA, PK, URL } from '../const';
import { ajax, toast } from 'nc-lightapp-front';
import { OrderCache } from '../../constance';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickSerachBtn(props, isRefresh) {
	let _this = this;
	let queryInfo = this.props.search.getQueryInfo(PAGEAREA.search23);
	if (queryInfo.querycondition) {
		let data = {
			queryInfo: queryInfo,
			pageCode: PAGECODE.pagecode23, //页面编码
			templetid: this.templet23id
		};
		ajax({
			url: URL.search23,
			data: data,
			success: (res) => {
				clearTransferCache(this.props, OrderCache.OrderTransferCache);
				this.setState({ ntotalnum: 0 });
				let { success, data } = res;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (success) {
					let content = null;
					content = data && data.length;
					this.props.transferTable.setTransferTableValue(
						PAGEAREA.head23,
						PAGEAREA.body23,
						data,
						PK.head23,
						PK.body23
					);
					isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(content);
				}
			}
		});
	}
}
