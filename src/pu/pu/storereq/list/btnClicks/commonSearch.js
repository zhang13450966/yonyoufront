/*
 * @Author: zhangchangqing 
 * @PageInfo: 页面功能描述  
 * @Date: 2018-05-24 11:30:23 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-06-21 14:45:15
 */

import { ajax } from 'nc-lightapp-front';
import { STOREREQ_LIST, ATTRCODE } from '../../siconst';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewControl';
export default function commonSerach(tabCode, searchVal, refresh, searchFlag) {
	
	let pageInfo = this.props.table.getTablePageInfo(STOREREQ_LIST.formId); //分页信息
	let queryInfo = this.props.search.getQueryInfo(STOREREQ_LIST.searchId, false);
	queryInfo.pageInfo = pageInfo;
	//如果searchVal有值说明是点击查询进入，没有值说明是点击翻页过来的，需要从缓存中获取
	if (searchVal) {
		queryInfo.querycondition = searchVal;
	} else {
		if (getDefData(STOREREQ_LIST.dataSource, 'searchVal')) {
			queryInfo.querycondition = getDefData(STOREREQ_LIST.dataSource, 'searchVal');
		}
	}
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, ATTRCODE.ctrantypeid);
	//设置页签数量的默认值;
	setDefData(STOREREQ_LIST.dataSource, 'searchVal', queryInfo.querycondition);
	let data = {
		queryInfo: queryInfo,
		pageCode: this.pageId, //页面编码
		currentTab: tabCode //当前页签编码
	};

	ajax({
		url: STOREREQ_LIST.queryListURL,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res.data === undefined || res.data === null) {
					this.props.table.setAllTableData(STOREREQ_LIST.formId, { rows: [] });
					this.setState({
						toCommitNum: '0',
						approvingNum: '0',
						executingNum: '0'
					});
					{
						getLangByResId(this, '4004STOREREQ-000021');
					} /* 国际化处理： 设置页签数量的默认值*/
					setDefData(STOREREQ_LIST.dataSource, 'tubNum', {
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
					setDefData(STOREREQ_LIST.dataSource, 'tubNum', {
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
							if (res.data.currentGrid && res.data.currentGrid[STOREREQ_LIST.formId]) {
								rowsData = res.data.currentGrid[STOREREQ_LIST.formId];
								//this.props.table.setAllTableData(this.head, data[this.head]);
							}
							this.props.table.setAllTableData(STOREREQ_LIST.formId, rowsData);
							buttonController.setListButtonVisiable(this.props, null);
						}
					);
				}
				if (searchFlag == true) {
					showSuccessInfo(getLangByResId(this, '4004STOREREQ-000041') /* 国际化处理： 查询成功！*/);
				}
				if (refresh) {
					showRefreshInfo();
				}
			}
		}
	});
}
