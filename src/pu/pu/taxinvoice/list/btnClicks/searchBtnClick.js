/*
 * @Author: jiangfw 
 * @PageInfo: 列表查询  
 * @Date: 2018-04-24 16:36:02 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-04-15 15:18:14
 */

import { ajax } from 'nc-lightapp-front';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { AREA, PAGECODE, REQUESTURL, BUTTONID, CACHDATASOURCE, CACHKEY, TABS } from '../../constance';
import {
	showHasQueryResultInfo,
	showNoQueryResultInfo,
	showRefreshInfo
} from 'src/scmpub/scmpub/pub/tool/messageUtil.js';
import { onSelected } from '../viewControl/rowSelectControl';

export default function clickSerachBtn(props, searchBtnFlag) {
	//获取查询条件
	let queryInfo = this.props.search.getQueryInfo(AREA.searchId, true);
	if (!queryInfo || !queryInfo.querycondition) {
		return;
	}
	let pageInfo = this.props.table.getTablePageInfo(AREA.listTableId); //分页信息
	queryInfo.pageInfo = pageInfo;
	queryInfo.pageCode = PAGECODE.listPagecode;

	ajax({
		url: REQUESTURL.query,
		data: queryInfo,
		success: (res) => {
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg);
				}
				if (res.data) {
					this.props.table.setAllTableData(AREA.listTableId, res.data[AREA.listTableId]);
					if (searchBtnFlag) {
						showHasQueryResultInfo(res.data[AREA.listTableId].pageInfo.total);
					} else {
						showRefreshInfo();
					}
				} else {
					this.props.table.setAllTableData(AREA.listTableId, { rows: [] });
					if (searchBtnFlag) {
						showNoQueryResultInfo();
					} else {
						showRefreshInfo();
					}
				}
				// 按钮可用性
				this.props.button.setDisabled({ [BUTTONID.Refresh]: false });
				onSelected.call(this, this.props);
			}
		}
	});
}
