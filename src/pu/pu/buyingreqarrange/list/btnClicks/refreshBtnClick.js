/*
 * @Author: zhangchangqing 
 * @PageInfo: 刷新按钮  
 * @Date: 2018-05-24 10:27:36 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 11:39:08
 */
import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST, BUYINGREQ_LIST_BUTTON } from '../../siconst';
import {
	showQueryResultInfoForNoPage,
	showSuccessInfo,
	showWarningInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
//import { initButtons } from '../afterEvents';
export default function refreshBtnClick(flagshow) {
	// 查询

	let _this = this;
	let type = '';
	let flag = false;
	let searchVal = this.state.searchVal;
	if (searchVal) {
		let length = searchVal.conditions.length;
		for (let j = 0; j < length; j++) {
			type = searchVal.conditions[j].field;
			//判断条件中是否有安排字段，再判断值为安排还是未安排
			if (type == 'pk_praybill_b.bisarrange') {
				let bisarrange = searchVal.conditions[length - 1].value.firstvalue; //是否安排
				if (bisarrange === 'Y' || bisarrange === true) {
					flag = true;
				}
			}
		}
	} else {
		return;
	}
	if (flag) {
		this.setState({
			showCheck: true
		});
	} else {
		this.setState({
			showCheck: false
		});
	}
	//初始化按钮都为不可用
	let disableArrdef = {
		[BUYINGREQ_LIST_BUTTON.Edit]: true, //安排
		[BUYINGREQ_LIST_BUTTON.BatchArrange]: true, //批量安排
		[BUYINGREQ_LIST_BUTTON.CancelArrange]: true, //取消安排
		[BUYINGREQ_LIST_BUTTON.Refresh]: false, //刷新
		[BUYINGREQ_LIST_BUTTON.Cancel]: true, //取消
		[BUYINGREQ_LIST_BUTTON.Save]: true //保存
	};
	_this.props.button.setDisabled(disableArrdef);
	let queryInfo = this.props.search.getQueryInfo(BUYINGREQ_LIST.searchId, false);
	queryInfo.querycondition = searchVal;
	let data = {
		queryInfo: queryInfo,
		pageCode: BUYINGREQ_LIST.listpageid //页面编码
	};

	ajax({
		url: BUYINGREQ_LIST.queryListURL,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.success) {
				if (res.data === undefined || res.data === null) {
					_this.props.editTable.setTableData(BUYINGREQ_LIST.formId, { rows: [] });
					_this.setState({
						toCommitNum: '0',
						approvingNum: '0',
						executingNum: '0'
					});
					if (flagshow) {
						// showQueryResultInfoForNoPage();
						showRefreshInfo();
					}
				} else {
					let toCommitNum; // 未提交数量
					let approvingNum; // 审批中数量
					let executingNum; //执行中数量
					if (res.data.tabNum) {
						toCommitNum = res.data.tabNum.toCommit;
						approvingNum = res.data.tabNum.approving;
						executingNum = res.data.tabNum.executing;
					}
					_this.setState(
						{
							toCommitNum: toCommitNum,
							approvingNum: approvingNum,
							executingNum: executingNum
						},
						() => {
							let currentTab = res.data.currentTab;
							let rowsData = { rows: [] };
							if (res.data.grid && res.data.grid[BUYINGREQ_LIST.formId]) {
								rowsData = res.data.grid[BUYINGREQ_LIST.formId];
							}
							_this.props.editTable.setTableData(BUYINGREQ_LIST.formId, rowsData);
							//initButtons.call(_this, _this.props, flag);
							buttonController.initButtons.call(_this, _this.props, flag);
							if (res.data.flag) {
								showSuccessInfo(
									getLangByResId(_this, '4004PRAYBILLARRANGE-000008')
								); /* 查询结果大于2000条，只展示2000条数据*/
							}
						}
					);
					if (!res.data.flag && flagshow) {
						// showQueryResultInfoForNoPage(res.data.grid.list_head.rows.length);
						showRefreshInfo();
					}
				}
			} else {
				//初始化按钮都为不可用
			}
		}
	});
}
