/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-22 16:54:44
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-28 16:38:12
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, LIST_BUTTON, OrderReviseCache } from '../../constance';
import {
	showQueryResultInfoForNoPage,
	showSuccessInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import buttonController from '../viewController/buttonController';

export default function commonSerach(queryInfo, isRefresh) {
	let _this = this;
	if (!isRefresh) {
		queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, true);
	}
	queryInfo = queryInfo || {};
	if (queryInfo.querycondition) {
		setDefData(OrderReviseCache.OrderReviseCacheKey, 'queryInfo', queryInfo);
		let pageInfo = this.props.table.getTablePageInfo(PAGECODE.list_head);
		queryInfo.pageInfo = pageInfo;
		let data = {
			queryInfo: queryInfo,
			pageCode: PAGECODE.listcode //页面编码
		};
		ajax({
			url: URL.getList,
			data: data,
			method: 'POST',
			success: (res) => {
				let { success, data } = res;
				let content = null;
				if (success) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						_this.props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					let rowsData = { rows: [] };
					let noEdit = true;
					if (data && data[PAGECODE.list_head]) {
						noEdit = false;
						rowsData = data[PAGECODE.list_head];
						content = rowsData.allpks.length;
					}
					_this.props.table.setAllTableData(PAGECODE.list_head, rowsData);
					isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(content);
					buttonController.onSelectedButtons.call(_this);
				}
			}
		});
	}
}

function toggleShow(_this, noEdit) {
	let disableArr = {
		[LIST_BUTTON.Annex_Management]: noEdit,
		[LIST_BUTTON.QueryAboutBusiness]: noEdit,
		[LIST_BUTTON.Print]: noEdit,
		[LIST_BUTTON.PrintCountQuery]: noEdit
		// [LIST_BUTTON.Refresh]: noEdit
	};
	_this.props.button.setDisabled(disableArr);
}
