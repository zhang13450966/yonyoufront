/*
 * @Author: zhaochyu
 * @PageInfo: 通用列表查询
 * @Date: 2018-05-08 13:43:33
 * @Last Modified by: zhr
 * @Last Modified time: 2020-01-04 11:05:38
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, HEAD_FIELD, URL, PAGECODE, FIELD, DATASOURCE, LIST_BUTTON, TABS } from '../../constance';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	showSuccessInfo,
	showNoQueryResultInfo,
	showQuerySuccess
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewControl';
export default function commonSearch(tabCode, searchVal, refresh, flag) {
	let refreshflag = refresh === LIST_BUTTON.Refresh;
	let pageInfo = this.props.table.getTablePageInfo(PAGECODE.tableId); //分页信息
	let queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId, false);
	queryInfo.pageInfo = pageInfo;
	//如果searchVal有值说明是点击查询进入，没有值说明是点击翻页过来的，需要从缓存中获取
	if (searchVal) {
		queryInfo.querycondition = searchVal;
	} else {
		let dddd = getDefData(DATASOURCE.dataSource, 'searchVal');
		if (dddd) {
			queryInfo.querycondition = getDefData(DATASOURCE.dataSource, 'searchVal');
		}
	}
	//交易类型处理
	queryInfo = transtypeUtils.beforeSearch.call(this, queryInfo, HEAD_FIELD.ctrantypeid, HEAD_FIELD.vtrantypecode);

	//设置页签数量的默认值
	setDefData(DATASOURCE.dataSource, 'searchVal', queryInfo.querycondition);
	// let pageInfo = this.props.table.getTablePageInfo(PAGECODE.tableId); //分页信息
	// let query = this.props.search.getQueryInfo(PAGECODE.searchId, searchVal);

	// if (!queryInfo.querycondition) {
	// 	return;
	// }
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.listpagecode,
		currentTab: TABS[tabCode]
	}; //分页信息 //查询区编码 //查询模板id //查询条件 //页面编码 //当前页签编码
	ajax({
		url: URL.query,
		IsGetPageData: true,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.success) {
				if (res.data.currentGrid == null) {
					this.props.table.setAllTableData(AREA.listTableArea, {
						rows: []
					});
					this.setState({ freeNum: '0' });
					if (!refreshflag && flag == undefined) {
						showQuerySuccess();
						return;
					}
				} else {
					let freeNum = 0; // 处理中数量
					if (res.data && res.data.tabNum && res.data.tabNum.free && res.data.currentTab) {
						freeNum = res.data.tabNum.free;
						setDefData(DATASOURCE.dataSource, FIELD.freeNum, freeNum);
					}
					this.setState(
						{
							freeNum: freeNum,
							currentTab: res.data.currentTab == FIELD.free ? 0 : 1
						},
						() => {
							let rowsData = { rows: [] };
							if (res.data && res.data.currentGrid && res.data.currentGrid.list_head) {
								rowsData = res.data.currentGrid.list_head;
							}
							this.props.table.setAllTableData(AREA.listTableArea, rowsData);
						}
					);
				}
				buttonController.lineSelected.call(this, this.props, this.state.currentTab);
				if (flag != true) {
					if (refreshflag) {
						showSuccessInfo(getLangByResId(this, '4004INITIALEST-000037')); /* 国际化处理： 刷新成功*/
					} else {
						showSuccessInfo(getLangByResId(this, '4004INITIALEST-000038')); /* 国际化处理： 查询成功*/
					}
				}
			}
		}
	});
}
