/*
 * @Author: zhangchangqing 
 * @PageInfo: 页面功能描述  
 * @Date: 2018-05-24 11:30:23 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:09:26
 */

import { ajax } from 'nc-lightapp-front';
import { TARGETADJ_LIST, ATTRCODE } from '../../siconst';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showSuccessInfo, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function commonSerach(tabCode, searchVal, refresh, searchFlag) {
	let pageInfo = this.props.table.getTablePageInfo(TARGETADJ_LIST.formId); //分页信息
	let queryInfo = this.props.search.getQueryInfo(TARGETADJ_LIST.searchId, false);
	queryInfo.pageInfo = pageInfo;
	//如果searchVal有值说明是点击查询进入，没有值说明是点击翻页过来的，需要从缓存中获取
	if (searchVal) {
		queryInfo.querycondition = searchVal;
	} else {
		if (getDefData(TARGETADJ_LIST.dataSource, 'searchVal')) {
			queryInfo.querycondition = getDefData(TARGETADJ_LIST.dataSource, 'searchVal');
		}
	}
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, ATTRCODE.ctrantypeid);
	//设置页签数量的默认值
	setDefData(TARGETADJ_LIST.dataSource, 'searchVal', queryInfo.querycondition);
	let data = {
		queryInfo: queryInfo,
		pageCode: this.pageId, //页面编码
		currentTab: tabCode //当前页签编码
	};
	ajax({
		url: TARGETADJ_LIST.queryListURL,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg);
				}
				if (res.data === undefined || res.data === null) {
					this.props.table.setAllTableData(TARGETADJ_LIST.formId, { rows: [] });
					this.setState({
						toCommitNum: '0',
						approvingNum: '0',
						executingNum: '0'
					});
					getLangByResId(this, '4001TARGETADJ-000031'); /* 国际化处理： 设置页签数量的默认值*/
					setDefData(TARGETADJ_LIST.dataSource, 'tubNum', {
						toCommitNum: '0',
						approvingNum: '0',
						executingNum: '0'
					});
				} else {
					let toCommitNum; // 未提交数量
					let approvingNum; // 审批中数量
					let executingNum; //执行中数量
					if (res.data.tabNum) {
						toCommitNum = res.data.tabNum.toCommit;
						approvingNum = res.data.tabNum.approving;
						executingNum = res.data.tabNum.executing;
					}
					setDefData(TARGETADJ_LIST.dataSource, 'tubNum', {
						toCommitNum: toCommitNum,
						approvingNum: approvingNum,
						executingNum: executingNum
					});
					this.setState(
						{
							toCommitNum: toCommitNum,
							approvingNum: approvingNum,
							executingNum: executingNum
						},
						() => {
							let currentTab = res.data.currentTab;
							let rowsData = { rows: [] };
							if (res.data.currentGrid && res.data.currentGrid[TARGETADJ_LIST.formId]) {
								rowsData = res.data.currentGrid[TARGETADJ_LIST.formId];
							}
							this.props.table.setAllTableData(TARGETADJ_LIST.formId, rowsData);

							buttonController.setListButtonVisiable(this.props, null);
						}
					);
				}
				if (searchFlag == true) {
					showSuccessInfo(getLangByResId(this, '4001TARGETADJ-000052')); /* 国际化处理： 查询成功！*/
				}
				if (refresh) {
					showRefreshInfo();
				}
			}
		}
	});
}
