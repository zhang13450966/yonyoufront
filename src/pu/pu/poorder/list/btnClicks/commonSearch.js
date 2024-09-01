/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-22 16:54:44
 * @Last Modified by: zhr
 * @Last Modified time: 2020-01-04 10:40:57
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, OrderCache } from '../../constance';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showSuccessInfo, showQuerySuccess, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';

export default function commonSerach(tabCode, queryInfo, noshow) {
	let _this = this;
	let searchflag = this.searchflag;
	let pageInfo = this.props.table.getTablePageInfo(PAGECODE.tableId); //分页信息
	if (!searchflag) {
		queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, false);
	} else if (queryInfo == null) {
		queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, true);
	}
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, FIELD.ctrantypeid);
	queryInfo = queryInfo || {};
	if (queryInfo.querycondition) {
		setDefData(OrderCache.OrderCacheKey, 'queryInfo', queryInfo);
		queryInfo.pageInfo = pageInfo;
		let data = {
			queryInfo: queryInfo,
			pageCode: PAGECODE.listcode, //页面编码
			currentTab: tabCode //当前页签编码
		};
		ajax({
			url: URL.getList,
			data: data,
			method: 'POST',
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						_this.props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					if (data == null) {
						_this.props.table.setAllTableData(PAGECODE.tableId, { rows: [] });
						_this.setState({
							uncommitNum: '0',
							approvingNum: '0',
							executNum: '0'
						});
					} else {
						let uncommitNum; // 未提交数量
						let approvingNum; // 审批中数量
						let executNum; //执行中
						if (data.tabNum) {
							uncommitNum = data.tabNum.toCommit == undefined ? 0 : data.tabNum.toCommit;
							approvingNum = data.tabNum.approving == undefined ? 0 : data.tabNum.approving;
							executNum = data.tabNum.executing == undefined ? 0 : data.tabNum.executing;
						}
						_this.setState(
							{
								uncommitNum: uncommitNum,
								approvingNum: approvingNum,
								executNum: executNum
							},
							() => {
								let currentTab = data.currentTab;
								let rowsData = { rows: [] };
								if (data.currentGrid && data.currentGrid[PAGECODE.tableId]) {
									rowsData = data.currentGrid[PAGECODE.tableId];
								}
								_this.props.table.setAllTableData(PAGECODE.tableId, rowsData);
							}
						);
						setDefData.call(this, OrderCache.OrderCacheKey, 'totalNum', {
							uncommitNum: uncommitNum,
							approvingNum: approvingNum,
							executNum: executNum
						});
					}
					//'查询成功！'
					if (noshow == 'isRefresh') {
						showRefreshInfo();
					} else if (noshow == undefined) {
						if (data && data.currentGrid && data.currentGrid[PAGECODE.tableId]) {
							showSuccessInfo(getLangByResId(_this, '4004POORDER-000006'));
						} else {
							showQuerySuccess();
						}
					}
					buttonController.initButtons.call(_this, _this.props);
				}
			}
		});
	}
}
