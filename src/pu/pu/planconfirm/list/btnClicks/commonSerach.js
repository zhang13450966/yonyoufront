/*
 * @Author: jiangfw
 * @PageInfo: 通用列表查询
 * @Date: 2018-05-08 13:43:33
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-02-23 20:56:51
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, COMMON, URL, FIELDS, PAGECODE } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import {
	showNoQueryResultInfo,
	showRefreshInfo,
	showSuccessInfo,
	showQuerySuccess
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function commonSerach(tabcode, queryInfo, isRefreash, isFirst) {
	let pageInfo = this.props.table.getTablePageInfo(AREA.head); //分页信息
	if (!queryInfo) {
		queryInfo = this.props.search.getQueryInfo(AREA.search, false);
		if (!queryInfo.querycondition) {
			queryInfo.querycondition = {};
		}
	}
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, 'ctrantypeid');
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.list, //页面编码
		currentTab: 'all' //当前页签编码
	};

	ajax({
		url: URL.listquery,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.success) {
				if (res.data === undefined || res.data == null) {
					this.props.table.setAllTableData(AREA.head, { rows: [] });
				} else {
					this.setState({}, () => {
						let currentTab = res.data.currentTab;
						let rowsData = { rows: [] };
						if (res.data.currentGrid && res.data.currentGrid.head) {
							rowsData = res.data.currentGrid.head;
							if (isRefreash) {
								showRefreshInfo();
							} else if (isFirst) {
							} else {
								showSuccessInfo(getLangByResId(this, '4004ARRIVAL-000058'));
							}
						} else {
							if (isRefreash) {
								showRefreshInfo();
							} else if (isFirst == undefined || isFirst) {
							} else {
								showQuerySuccess();
							}
						}
						this.props.table.setAllTableData(AREA.head, rowsData);
					});
				}
				let butArray = [
					'ReturnArrival',
					'Delete',
					'Commit',
					'UnCommit',
					'AccessoryManage',
					'QueryAboutBusiness',
					'Print',
					'OutPrint',
					'CombinPrint'
				];
				this.props.button.setButtonDisabled(butArray, true);
			}
		}
	});
}
