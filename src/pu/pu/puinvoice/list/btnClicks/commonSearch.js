/*
 * @Author: jiangfw
 * @PageInfo: 通用列表查询
 * @Date: 2018-05-08 13:43:33
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-05-14 16:05:38
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA, COMMON, FIELD } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showQuerySuccess } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { btnController } from '../viewControl';

export default function commonSerach(tabCode, queryInfo, queryFlag, refBillQueryData) {
	// 点击全部页签时，若未输入查询条件，就不查
	if (AREA.all == tabCode && !queryInfo) {
		// 点击全部页签时，若未输入查询条件，就不查
		let rowsData = { rows: [] };
		this.props.table.setAllTableData(this.tableId, rowsData);
		return;
	}

	// 组装查询条件
	if (queryInfo == undefined) {
		queryInfo = this.props.search.getQueryInfo(AREA.queryArea, false);
	}
	queryInfo = queryInfo || {};
	// 分页信息
	let pageInfo = this.props.table.getTablePageInfo(this.tableId);
	queryInfo.pageInfo = pageInfo;
	// 交易类型逻辑添加,如果交易类型发布的节点,需要添加交易类型
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, FIELD.ctrantypeid);

	let data = {
		queryInfo: queryInfo,
		pageCode: this.pageId, //页面编码
		currentTab: tabCode, //当前页签编码
	};

	ajax({
		url: URL.pageQuery,
		data: data,

		success: res => {
			let { success, data } = res;
			if (success) {
				let toCommitNum = '0'; // 未提交数量
				let approvingNum = '0'; // 审批中数量
				if (data) {
					// 执行公式
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					if (res.data.tabNum) {
						toCommitNum = res.data.tabNum.toCommit;
						approvingNum = res.data.tabNum.approving;
					}
					if (res.data.currentGrid && res.data.currentGrid[this.tableId]) {
						this.setState(
							{
								toCommitNum: toCommitNum,
								approvingNum: approvingNum,
							},
							() => {
								let rowsData = { rows: [] };
								if (res.data.currentGrid && res.data.currentGrid[this.tableId]) {
									rowsData = res.data.currentGrid[this.tableId];
								}
								this.props.table.setAllTableData(this.tableId, rowsData);
							}
						);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
						this.setState({
							toCommitNum: toCommitNum,
							approvingNum: approvingNum,
						});
					}

					if (!queryFlag) {
						if (data && data.currentGrid && res.data.currentGrid[this.tableId]) {
							showSuccessInfo(getLangByResId(this, '4004PUINVOICE-000077' /* 国际化处理： 查询成功！*/));
						} else {
							showQuerySuccess();
						}
					} else {
						if (queryFlag == '1') {
							showSuccessInfo(getLangByResId(this, '4004PUINVOICE-000076' /* 国际化处理： 刷新成功！*/));
						}
					}
				}

				setDefData(COMMON.PuinvoiceCacheKey, 'totalNum', {
					toCommitNum: toCommitNum,
					approvingNum: approvingNum,
				});
				if (refBillQueryData) {
					reloadbillCache.call(this, refBillQueryData);
				} else {
					btnController.call(this, this.props);
				}
			}
		},
	});
}

function reloadbillCache(refBillQueryData) {
	ajax({
		url: '/nccloud/pu/pub/refbillqueryaction.do',
		data: refBillQueryData,
		success: res => {
			if (res.success) {
				if (res.data) {
					setDefData(COMMON.PuinvoiceCacheKey, COMMON.RefBillTypeInfo, res.data);
					btnController.call(this, this.props);
				}
			}
		},
	});
}
