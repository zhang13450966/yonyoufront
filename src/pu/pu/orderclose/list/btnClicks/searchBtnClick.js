/*
 * @Author: CongKe
 * @PageInfo: 采购订单关闭页面查询功能
 * @Date: 2018-04-17 19:06:54
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-26 15:39:33
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, ORDERCLOSECACHE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import {
	showSuccessInfo,
	showHasQueryResultInfo,
	showWarningInfo,
	showQueryResultInfoForNoPage,
	showRefreshInfo,
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewController/index';

export default function searchBtnClick(props, searchVal, isRefresh) {
	let _this = this;
	let pageInfo = this.props.editTable.getTablePageInfo(PAGECODE.tableId); //分页信息
	let queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId);
	let templetid = getDefData(ORDERCLOSECACHE.CLOSECACHE, PAGECODE.templetid); //模板ID
	if (queryInfo.querycondition) {
		queryInfo.pageInfo = pageInfo;
		let data = {
			queryInfo: queryInfo,
			pageCode: PAGECODE.listcode, //页面编码
			templetid: templetid,
		};
		ajax({
			url: URL.getList,
			data: data,
			method: 'POST',
			success: res => {
				let { success, data } = res;
				if (success) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						_this.props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					let rowsData = { rows: [] };
					let backdata = data && data.result && data.result[PAGECODE.tableId];
					rowsData = backdata != null && backdata != '' ? backdata : rowsData;
					_this.props.editTable.setTableData(PAGECODE.tableId, rowsData);
					if (isRefresh == true) {
						showRefreshInfo();
					} else if (data) {
						let messa = data.message; //当查询出来的结果大于两千条，只显示2000条数据，并进行提示
						if (messa) {
							showWarningInfo(null, messa);
						} else {
							showQueryResultInfoForNoPage(rowsData.rows.length); //显示查询成功条数
						}
					} else {
						showQueryResultInfoForNoPage(); //显示查询成功条数
					}
					buttonController.selectedChange.call(this, this.props);
				}
			},
		});
	}
}
