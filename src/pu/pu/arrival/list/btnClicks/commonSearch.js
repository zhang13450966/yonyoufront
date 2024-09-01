/*
 * @Author: jiangfw
 * @PageInfo: 通用列表查询
 * @Date: 2018-05-08 13:43:33
 * @Last Modified by: zhr
 * @Last Modified time: 2021-04-19 10:02:07
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
export default function commonSerach(tabCode, queryInfo, isRefreash, isFirst) {
	let pageInfo = this.props.table.getTablePageInfo(AREA.head); //分页信息
	let custconditions = [
		//页签信息
		{
			field: tabCode,
			value: { firstvalue: tabCode }
		}
	];
	if (!queryInfo) {
		queryInfo = this.props.search.getQueryInfo(AREA.searchArea, false);
		if (!queryInfo.querycondition) {
			queryInfo.querycondition = {};
		}
	}
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, 'ctrantypeid');
	queryInfo.pageInfo = pageInfo;
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.head, //页面编码
		currentTab: tabCode //当前页签编码
	};

	ajax({
		url: URL.queryScheme,
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
					this.setState({
						toCommitNum: '0',
						approvingNum: '0',
						exeNum: '0'
					});
				} else {
					let toCommitNum; // 未提交数量
					let approvingNum; // 审批中数量
					let exeNum;
					if (res.data.tabNum) {
						toCommitNum = res.data.tabNum.toCommit;
						approvingNum = res.data.tabNum.approving;
						exeNum = res.data.tabNum.exe;
					}
					this.setState(
						{
							toCommitNum: toCommitNum,
							approvingNum: approvingNum,
							exeNum: exeNum
						},
						() => {
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
						}
					);
					setDefData.call(this, COMMON.arrivalCacheKey, 'totalNum', {
						currentTab: tabCode,
						toCommitNum: toCommitNum,
						approvingNum: approvingNum,
						processingNum: exeNum
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
					'CombinPrint',
					'SplitPrint',
					'UrgentLetGo'
				];
				this.props.button.setButtonDisabled(butArray, true);
			}
		}
	});
}
