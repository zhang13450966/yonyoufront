/*
 * @Author: CongKe 
 * @PageInfo: 采购订单付款计划页面查询功能 
 * @Date: 2018-04-17 19:06:54 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-04-26 11:40:20
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, STATUS, FIELD, BUTTON, PAYPLANDATASOURCE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	showWarningInfo,
	showSuccessInfo,
	showHasQueryResultInfo,
	showWarningDialog,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewController/index';

export default function searchBtnClick(props, isRefresh) {
	let queryInfo;
	queryInfo = props.search.getQueryInfo(PAGECODE.searchId, true);
	let templetid = getDefData(PAYPLANDATASOURCE.PAYPLANCACHE, PAGECODE.templetid); //模板ID
	if (queryInfo.querycondition) {
		let data = {
			queryInfo: queryInfo,
			pageCode: PAGECODE.listcode, //页面编码
			templetid: templetid,
			currentTab: 'all' //当前页签编码
		};
		ajax({
			url: URL.getList,
			data: data,
			method: 'POST',
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					this.frozen = data ? data.frozen : {};
					data = data && data.result;
					let rowsData = { rows: [] };
					let backdata = data && data.result && data.result[PAGECODE.tableId];
					rowsData = backdata != null && backdata != '' ? backdata : rowsData;
					props.editTable.setTableData(PAGECODE.tableId, rowsData);
					buttonController.togglePageShow.call(this, props, STATUS.browse);
					if (isRefresh == true) {
						showRefreshInfo();
					} else if (data) {
						props.button.setDisabled([ BUTTON.Edit ], false);
						let messa = data.message;
						if (messa) {
							showWarningInfo(null, messa);
						} else {
							showHasQueryResultInfo(rowsData.rows.length); //显示查询成功条数
						}
					} else {
						showWarningInfo(
							getLangByResId(this, '4004OPAYPLAN-000017'),
					
						); /* 国际化处理： 请注意,无符合条件数据*/

						props.button.setDisabled([ BUTTON.Edit ], true);
					}
					buttonController.pageinfoinit.call(this, props);
					buttonController.onSelectButton.call(this, props);
				}
			}
		});
	}
}
