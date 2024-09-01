/*
 * @Author: 刘奇 
 * @PageInfo: 查询公共处理方法
 * @Date: 2019-03-05 14:58:52 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-13 09:33:47
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { buttonControl } from '../viewController/buttonController';
import {
	showNoQueryResultInfo,
	showHasQueryResultInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';

export default function clickSerachBtn(props, queryInfo, isRefresh) {
	// 分页信息
	let pageInfo = this.props.table.getTablePageInfo(ARSUB_CONST.formId);
	if (queryInfo == undefined) {
		queryInfo = this.props.search.getQueryInfo(ARSUB_CONST.searchId);
	}
	queryInfo = queryInfo || {};
	queryInfo.pageInfo = pageInfo;
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, ArsubHeadItem.ctrantypeid);
	let data = {
		queryInfo: queryInfo,
		pageCode: ARSUB_CONST.listPageId,
		currentTab: 'all' //当前页签编码
	};
	ajax({
		url: ARSUB_CONST.queryListUrl,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			let { success } = res;
			let data = res.data['currentGrid'];
			if (data) {
				let rowsData = { rows: [] };
				if (data && data[ARSUB_CONST.formId]) {
					rowsData = data[ARSUB_CONST.formId];
				}
				this.props.table.setAllTableData(ARSUB_CONST.formId, rowsData);
				if (isRefresh) {
					showRefreshInfo();
				} else {
					showHasQueryResultInfo(data[ARSUB_CONST.formId].allpks.length);
				}
			} else {
				this.props.table.setAllTableData(ARSUB_CONST.formId, { rows: [] });
				if (isRefresh) {
					showRefreshInfo();
				} else {
					showNoQueryResultInfo();
				}
			}
			buttonControl.call(this, this.props);
		}
	});
}
