/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单列表，查询区查询按钮
 * @Date: 2021-11-19 15:06:20 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-02-23 19:45:58
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, CONSTFIELD, FIELD, AREA } from '../../constance';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import {
	showSuccessInfo,
	showErrorInfo,
	showQueryResultInfoForNoPage
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import buttonController from '../viewController/buttonController';
import transtypeUtils from '../../../../../scmpub/scmpub/pub/tool/transtypeUtils';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function queryBtnClick(props, isRefresh) {
	let queryInfo;
	if (isRefresh) {
		queryInfo = props.search.getQueryInfo(AREA.search, false);
		//刷新时，从缓存中获取查询条件
		let querycondition = getDefData(CONSTFIELD.dataSource, CONSTFIELD.conditionCache);
		if (!querycondition) {
			showErrorInfo(getLangByResId(this, '4004planconfirm-000007')); /* 国际化处理： 请先查询数据！*/
			return;
		}
		queryInfo.querycondition = querycondition;
	} else {
		queryInfo = props.search.getQueryInfo(AREA.search);
		//查询时把查询条件缓存下来
		setDefData(CONSTFIELD.dataSource, CONSTFIELD.conditionCache, queryInfo.querycondition);
	}
	let pageInfo = props.table.getTablePageInfo(AREA.head);
	queryInfo.pageInfo = pageInfo;
	// 用于设置发布小应用，查询区交易类型的默认值设置，发布小应用交易类型不可编辑
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, FIELD.ctranstypeid);
	// 将查询条件缓存
	this.setState({ searchVal: queryInfo });
	ajax({
		url: URL.listquery,
		data: {
			queryInfo: queryInfo,
			pageCode: PAGECODE.list, //页面编码
			currentTab: 'all' //当前页签编码
		},
		method: 'post',
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.success) {
				this.props.table.setAllTableData(AREA.head, { rows: [] });
				let count = 0;
				if (
					res.data &&
					res.data.currentGrid &&
					res.data.currentGrid[AREA.head] &&
					res.data.currentGrid[AREA.head].rows
				) {
					this.props.table.setAllTableData(AREA.head, res.data.currentGrid[AREA.head]);
					count = res.data.currentGrid[AREA.head].rows.length;
				}
				if (isRefresh) {
					showSuccessInfo(getLangByResId(this, '4004planconfirm-000008')); /* 国际化处理： 刷新成功！*/
				} else {
					// 查询成功，需要提示成功条数，无数据是提示“未查询出符合条件的数据 ”
					let allNum = 0;
					if (
						res.data.currentGrid &&
						res.data.currentGrid[AREA.head] &&
						res.data.currentGrid[AREA.head].allpks
					) {
						allNum = res.data.currentGrid[AREA.head].allpks.length;
					}
					showQueryResultInfoForNoPage(allNum);
				}
			}
			// buttonController.setButtonStatus.call(this, this.props);
		}
	});
}
