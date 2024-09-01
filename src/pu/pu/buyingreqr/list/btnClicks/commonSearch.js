/*
 * @Author: zhangchangqing 
 * @PageInfo: 页面功能描述  
 * @Date: 2018-05-24 11:30:23 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-05-31 09:48:58
 */

import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST, BUYINGREQ_LIST_BUTTON } from '../../siconst';
import { hasListCache, getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import initBtn from './initButtons';
import { buttonController, btnClickController } from '../viewControl';
export default function commonSerach(tabCode, searchVal, isRefresh) {
	let pageInfo = this.props.table.getTablePageInfo(BUYINGREQ_LIST.formId); //分页信息
	let queryInfo = this.props.search.getQueryInfo(BUYINGREQ_LIST.searchId, false);
	queryInfo.pageInfo = pageInfo;
	//如果searchVal有值说明是点击查询进入，没有值说明是点击翻页过来的，需要从缓存中获取
	if (searchVal) {
		queryInfo.querycondition = searchVal;
	} else {
		if (getDefData(BUYINGREQ_LIST.dataSource, 'searchVal')) {
			queryInfo.querycondition = getDefData(BUYINGREQ_LIST.dataSource, 'searchVal');
		}
	}
	//将查询条件缓存
	setDefData(BUYINGREQ_LIST.dataSource, 'searchVal', queryInfo.querycondition);
	if (getDefData(BUYINGREQ_LIST.dataSource, 'searchVal')) {
		let disableArrdef = {
			[BUYINGREQ_LIST_BUTTON.Refresh]: false //刷新
		};
		this.props.button.setDisabled(disableArrdef);
	}
	let data = {
		queryInfo: queryInfo,
		pageCode: this.pageId, //页面编码
		currentTab: BUYINGREQ_LIST.all //请购单修订只查询全部的单据
	};
	//初始化按钮都为不可用
	let flag = true;
	//initBtn.call(this, this.props, flag);
	buttonController.setListButtonVisiable.call(this, this.props, flag);
	ajax({
		url: BUYINGREQ_LIST.queryListURL,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg);
				}
				if (res.data === undefined || res.data === null) {
					this.props.table.setAllTableData(BUYINGREQ_LIST.formId, { rows: [] });
					// this.setState({
					// 	toCommitNum: '0',
					// 	approvingNum: '0',
					// 	executingNum: '0'
					// });
					isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage();
				} else {
					let toCommitNum; // 未提交数量
					let approvingNum; // 审批中数量
					let executingNum; //执行中数量
					if (res.data.tabNum) {
						toCommitNum = res.data.tabNum.toCommit;
						approvingNum = res.data.tabNum.approving;
						executingNum = res.data.tabNum.executing;
					}
					this.setState(
						{
							toCommitNum: toCommitNum,
							approvingNum: approvingNum,
							executingNum: executingNum
						},
						() => {
							let currentTab = res.data.currentTab;
							let rowsData = { rows: [] };
							if (res.data.currentGrid && res.data.currentGrid[BUYINGREQ_LIST.formId]) {
								rowsData = res.data.currentGrid[BUYINGREQ_LIST.formId];
								//this.props.table.setAllTableData(this.head, data[this.head]);
							}
							this.props.table.setAllTableData(BUYINGREQ_LIST.formId, rowsData);
						}
					);
					flag = false;
					//initBtn.call(this, this.props, flag);
					buttonController.setListButtonVisiable.call(this, this.props, flag);
					if (isRefresh == true) {
						showRefreshInfo();
					} else if (res.data.tabNum.all > 0) {
						showQueryResultInfoForNoPage(res.data.tabNum.all);
					} else {
						showQueryResultInfoForNoPage();
					}
				}
			}
		}
	});
}
