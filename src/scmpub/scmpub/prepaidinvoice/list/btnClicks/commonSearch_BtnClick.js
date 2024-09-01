/*
 * @Author: 刘奇 
 * @PageInfo: 查询公共处理方法
 * @Date: 2019-03-05 14:58:52 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:19:39
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST } from '../../const';
import { buttonControl } from '../viewController/buttonController';
import {
	showNoQueryResultInfo,
	showHasQueryResultInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickSerachBtn(props, queryInfo, isRefresh) {
	// 分页信息
	let pageInfo = this.props.table.getTablePageInfo(PREPAIDINVOICE_CONST.formId);
	if (queryInfo == undefined) {
		queryInfo = this.props.search.getQueryInfo(PREPAIDINVOICE_CONST.searchId);
	}
	queryInfo = queryInfo || {};
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PREPAIDINVOICE_CONST.listPageId,
		currentTab: 'all' //当前页签编码
	};
	ajax({
		url: PREPAIDINVOICE_CONST.queryListUrl,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			let data = res.data['currentGrid'];
			if (data) {
				let rowsData = { rows: [] };
				if (data[PREPAIDINVOICE_CONST.formId]) {
					rowsData = data[PREPAIDINVOICE_CONST.formId];
				}
				this.props.table.setAllTableData(PREPAIDINVOICE_CONST.formId, rowsData);
				if (isRefresh) {
					showRefreshInfo();
				} else {
					showHasQueryResultInfo(data[PREPAIDINVOICE_CONST.formId].allpks.length);
				}
			} else {
				this.props.table.setAllTableData(PREPAIDINVOICE_CONST.formId, { rows: [] });
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
