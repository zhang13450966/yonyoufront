/**
 * add by huoyzh
 * @param {*} tabCode 
 * @param {*} queryInfo 
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, OrderCache, BUTTON } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showHasQueryResultInfo, showQuerySuccess } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
export default function commonSerach(tabCode, queryInfo, searchVal) {
	let searchflag = this.searchflag; //查询标志
	let pageInfo = this.props.table.getTablePageInfo(PAGECODE.tableId); //分页信息
	// if (!searchflag || queryInfo == null) {
	// 	queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, false);
	// } else {
	// 	queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, true);
	// }
	if (!queryInfo) {
		queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, false);
		if (!queryInfo.querycondition) {
			queryInfo.querycondition = {};
		}
	}
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, 'ctrantypeid');
	//queryInfo = queryInfo || {};
	if (queryInfo.querycondition) {
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
						this.props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					if (data == null) {
						this.props.table.setAllTableData(PAGECODE.tableId, { rows: [] });
						this.setState({
							uncommitNum: '0', //返回数据为空，显示待提交，和审批中数量为0
							approvingNum: '0'
						});
						showQuerySuccess();
					} else {
						let uncommitNum; // 未提交数量
						let approvingNum; // 审批中数量
						if (data.tabNum) {
							uncommitNum = data.tabNum.toCommit == undefined ? 0 : data.tabNum.toCommit;
							approvingNum = data.tabNum.approving == undefined ? 0 : data.tabNum.approving;
						}
						this.setState(
							{
								uncommitNum: uncommitNum,
								approvingNum: approvingNum
							},
							() => {
								let currentTab = data.currentTab;
								let rowsData = { rows: [] };
								if (res.data.currentGrid && res.data.currentGrid[PAGECODE.tableId]) {
									rowsData = res.data.currentGrid[PAGECODE.tableId];
								}
								this.props.table.setAllTableData(PAGECODE.tableId, rowsData);
							}
						);
						setDefData.call(this, OrderCache.OrderCacheKey, 'totalNum', {
							uncommitNum: uncommitNum,
							approvingNum: approvingNum
						});
						if (searchVal == BUTTON.Refresh) {
							showSuccessInfo(getLangByResId(this, '4004PRICESTL-000010')); /* 国际化处理： 刷新成功*/
						} else if (searchVal == 'query') {
							// showHasQueryResultInfo(res.data.currentGrid[PAGECODE.tableId].pageInfo.total);
							if (!(data.currentGrid && data.currentGrid[PAGECODE.tableId])) {
								showQuerySuccess();
							} else {
								showHasQueryResultInfo(res.data.currentGrid[PAGECODE.tableId].pageInfo.total);
								// showSuccessInfo(getLangByResId(this, '4004PRICESTL-000022')); /* 国际化处理： 查询成功*/
							}
						} else {
						}
					}
				}
			}
		});
	}
}
