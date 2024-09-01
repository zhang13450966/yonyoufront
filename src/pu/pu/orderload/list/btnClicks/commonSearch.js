/*
 * @Author: CongKe
 * @PageInfo: 查询实现方法
 * @Date: 2019-04-17 09:16:01
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-08-01 15:35:21
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, URL, BUTTONID } from '../../constance';
import { showRefreshInfo, showQueryResultInfoForNoPage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(props, queryInfo, isRefresh) {
	let pageInfo = props.table.getTablePageInfo(AREA.listTableId); //分页信息
	queryInfo.pageInfo = pageInfo;

	ajax({
		url: URL.pageQuery,
		data: queryInfo,
		success: res => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				//参数一：返回的公式对象
				props.dealFormulamsg(res.formulamsg);
			}
			let total = null;
			if (res.data) {
				total = res.data[AREA.listTableId] && res.data[AREA.listTableId].pageInfo.total;
				props.table.setAllTableData(AREA.listTableId, res.data[AREA.listTableId]);
			} else {
				props.table.setAllTableData(AREA.listTableId, { rows: [] });
			}
			isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(total);
			props.button.setDisabled({ [BUTTONID.Refresh]: false });
		},
	});
}
