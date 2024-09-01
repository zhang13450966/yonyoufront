/*
 * @Author: liujia9 
 * @PageInfo: 查询实现方法 
 * @Date: 2018-09-29 11:35:45 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 13:37:21
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, BUTTONID } from '../../constance';
import {
	showHasQueryResultInfo,
	showNoQueryResultInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonControl } from '../viewControl/buttonControl';

export default function(props, queryInfo, isRefresh) {
	let pageInfo = props.table.getTablePageInfo(AREA.listTableId); //分页信息
	queryInfo.pageInfo = pageInfo;

	ajax({
		url: URL.search,
		data: queryInfo,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.data) {
				isRefresh == true
					? showRefreshInfo()
					: showHasQueryResultInfo(res.data[AREA.listTableId].pageInfo.total);
				props.table.setAllTableData(AREA.listTableId, res.data[AREA.listTableId]);
			} else {
				isRefresh == true ? showRefreshInfo() : showNoQueryResultInfo();
				props.table.setAllTableData(AREA.listTableId, { rows: [] });
			}
			// 按钮状态控制
			buttonControl(props);
		}
	});
}
