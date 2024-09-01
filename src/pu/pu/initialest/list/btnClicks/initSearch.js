/*
 * @Author: zhaochyu
 * @PageInfo: 列表返回卡片默认查询
 * @Date: 2018-08-08 17:08:11
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-03-08 10:21:29
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE, FIELD, DATASOURCE, HEAD_FIELD } from '../../constance';
import { hasListCache, setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
export default function initSearch(props, tabCode, flag = false) {
	let hasCacheData = hasListCache(props, DATASOURCE.dataSource);
	if (!hasCacheData) {
		let pageInfo = this.props.table.getTablePageInfo(PAGECODE.tableId); //分页信息
		let query = this.props.search.getQueryInfo(PAGECODE.searchId, flag);
		//交易类型处理
		let queryInfo = transtypeUtils.beforeSearch.call(this, query, HEAD_FIELD.ctrantypeid, HEAD_FIELD.vtrantypecode);
		queryInfo.pageInfo = pageInfo;
		if (!queryInfo.querycondition) {
			return;
		}
		let data = {
			queryInfo: queryInfo,
			pageCode: PAGECODE.listpagecode,
			currentTab: tabCode
		}; //分页信息 //查询区编码 //查询模板id //查询条件 //页面编码 //当前页签编码
		ajax({
			url: URL.query,
			data: data,
			method: 'post',
			success: (res) => {
				if (res.success) {
					if (res.data === undefined) {
						this.props.table.setAllTableData(AREA.listTableArea, {
							rows: []
						});
						this.setState({ freeNum: '0' });
						setDefData(DATASOURCE.dataSource, FIELD.freeNum, 0);
					} else {
						let freeNum = 0; // 处理中数量
						if (res.data && res.data.tabNum && res.data.tabNum.free) {
							freeNum = res.data.tabNum.free;
							setDefData(DATASOURCE.dataSource, FIELD.freeNum, freeNum);
						}
						this.setState({ freeNum: freeNum }, () => {
							if (res.data && res.data.currentTab) {
								let currentTab = res.data.currentTab;
								if (currentTab == 'free') {
									setDefData(DATASOURCE.dataSource, FIELD.currentTab, 0);
								} else {
									setDefData(DATASOURCE.dataSource, FIELD.currentTab, 1);
								}
							}
							let rowsData = { rows: [] };
							if (res.data && res.data.currentGrid && res.data.currentGrid.list_head) {
								rowsData = res.data.currentGrid.list_head;
								let rowslength = res.data.currentGrid.list_head.allpks.length;
								let currentlength = 0;
								if (rowslength > 10) {
									currentlength = 9;
								} else {
									currentlength = rowslength - 1;
								}
								let pk_initialest =
									res.data.currentGrid.list_head.rows[currentlength].values.pk_initialest.value;
								setDefData(DATASOURCE.dataSource, FIELD.endpk_initialest, pk_initialest);
							}
							this.props.table.setAllTableData(AREA.listTableArea, rowsData);
						});
					}
				}
			}
		});
	} else {
		let oldfreeNum = getDefData(DATASOURCE.dataSource, FIELD.freeNum);
		let oldcrrentTab = getDefData(DATASOURCE.dataSource, FIELD.currentTab);
		this.setState({
			freeNum: oldfreeNum,
			currentTab: oldcrrentTab
		});
	}
}
