import { ajax } from 'nc-lightapp-front';
import { PAGECODE, BUTTON, COMMON } from '../../constance';
import {
	showSuccessInfo,
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo,
	showRefreshInfo,
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';

export default function searchBtnClick(props, searchVal, isRefresh) {
	let isCanSearch = this.props.search.getAllSearchData(PAGECODE.searchId);
	if (!isCanSearch) {
		return;
	}
	isRefresh = true;
	let data = getDefData(COMMON.settlebillCacheKey, 'settlebillsearchdata');
	if (!data) {
		let pageInfo = this.props.table.getTablePageInfo(PAGECODE.tableId);
		this.setState({ searchVal: searchVal });
		let queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, true);
		data = {
			queryInfo: {
				pageInfo: pageInfo,
				queryAreaCode: PAGECODE.searchId,
				oid: queryInfo.oid,
				querytype: queryInfo.querytype,
				querycondition: queryInfo.querycondition ? queryInfo.querycondition : null,
			},
			pageCode: PAGECODE.pagecode,
			currentTab: 'ALL',
		};
	}
	ajax({
		url: '/nccloud/pu/settlebill/query.do',
		data: data,
		success: res => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			let { success } = res;
			if (success) {
				if (res.data && res.data.currentGrid && res.data.currentGrid.settlebill_list) {
					let rowsData = res.data.currentGrid.settlebill_list;
					this.props.table.setAllTableData(PAGECODE.tableId, rowsData);
					isRefresh == true
						? showRefreshInfo()
						: showQueryResultInfoForNoPage(rowsData.rows.length); /* 国际化处理： 查询成功*/
				} else {
					this.props.table.setAllTableData(PAGECODE.tableId, { rows: [] });
					isRefresh == true ? showRefreshInfo() : showNoQueryResultInfo(); /* 国际化处理： 查询成功*/
				}
				let butArray = [
					BUTTON.cancelToIA,
					BUTTON.del,
					BUTTON.file,
					BUTTON.linkQuery,
					BUTTON.print,
					BUTTON.sendToIA,
					BUTTON.review,
					BUTTON.output,
				];
				this.props.button.setButtonDisabled(butArray, true);
			}
		},
	});
}
