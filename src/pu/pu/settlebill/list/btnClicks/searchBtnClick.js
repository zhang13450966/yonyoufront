import { ajax } from 'nc-lightapp-front';
import { PAGECODE, BUTTON, COMMON } from '../../constance';
import {
	showSuccessInfo,
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo,
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';

export default function searchBtnClick(props, searchVal) {
	let isCanSearch = this.props.search.getAllSearchData(PAGECODE.searchId);
	if (!isCanSearch) {
		return;
	}
	let pageInfo = this.props.table.getTablePageInfo(PAGECODE.tableId);
	this.setState({ searchVal: searchVal });
	let queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, true);
	let data = {
		queryInfo: {
			pageInfo: pageInfo,
			queryAreaCode: PAGECODE.searchId,
			oid: queryInfo.oid,
			querytype: queryInfo.querytype,
			querycondition: queryInfo.querycondition ? queryInfo.querycondition : null,
		},
		pageCode: PAGECODE.pagecode,
		currentTab: 'ALL',
	}; //分页信息 //查询区编码 //查询模板id //查询条件 //页面编码 //当前页签编码

	this.searchdata = data;
	setDefData(COMMON.settlebillCacheKey, 'settlebillsearchdata', data);
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
					showQueryResultInfoForNoPage(rowsData.rows.length); /* 国际化处理： 查询成功*/
				} else {
					this.props.table.setAllTableData(PAGECODE.tableId, { rows: [] });
					showNoQueryResultInfo(); /* 国际化处理： 查询成功*/
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
				this.props.button.setButtonDisabled([BUTTON.refreash], false);
			}
		},
	});
}
