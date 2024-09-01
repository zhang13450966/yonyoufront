/*
 * @Author: qishy
 * @PageInfo: 通用列表查询  
 * @Date: 2018-05-08 13:43:33 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-07-26 15:16:59
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, REQUESTURL, BUTTONID, CACHDATASOURCE, CACHKEY, TABS } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import {
	showHasQueryResultInfo,
	showRefreshInfo,
	showNoQueryResultInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { onSelected } from '../viewControl/rowSelectControl';

export default function(tabCode, queryInfo, flag, operateParam) {
	tabCode = TABS.all;
	if (!flag) {
		if (!queryInfo || !queryInfo.querycondition) {
			queryInfo = this.props.search.getQueryInfo(AREA.searchId, flag);
		}
	}

	let pageInfo = this.props.table.getTablePageInfo(AREA.listTableId); //分页信息
	queryInfo.pageInfo = pageInfo;

	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.listPagecode, //页面编码
		currentTab: tabCode //当前页签编码
	};

	ajax({
		url: REQUESTURL.query,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (res.data) {
					if (res.data.currentGrid) {
						// 设置数据
						this.props.table.setAllTableData(AREA.listTableId, res.data.currentGrid.head);
						if (flag) {
							showHasQueryResultInfo(res.data.currentGrid.head.pageInfo.total);
						} else {
							showRefreshInfo();
						}
					} else {
						this.props.table.setAllTableData(AREA.listTableId, { rows: [] });
						showNoQueryResultInfo();
					}
				} else {
					this.props.table.setAllTableData(AREA.listTableId, { rows: [] });
					showNoQueryResultInfo();
				}

				// 按钮可用性
				this.props.button.setDisabled({ [BUTTONID.Refresh]: false });
				onSelected.call(this, this.props);
			}
			// 将查询条件缓存
			setDefData(CACHDATASOURCE.dataSourceList, CACHKEY.searchCach, queryInfo);
		}
	});
}
