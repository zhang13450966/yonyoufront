/*
 * @Author: xiahui 
 * @PageInfo: 查询 
 * @Date: 2019-06-11 15:35:40 
 * @Last Modified by: xiahui 
 * @Last Modified time: 2019-06-11 15:35:40 
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance';
import { showHasQueryResultInfo, showNoQueryResultInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function() {
	let queryInfo = this.props.search.getQueryInfo(AREA.searchId, true);
	if (!queryInfo || !queryInfo.querycondition) {
		return;
	}
	//得到数据渲染到页面
	ajax({
		url: URL.query,
		data: queryInfo,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				this.props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.success) {
				if (res.data) {
					showHasQueryResultInfo(res.data[AREA.stockinId].rows.length);
					this.props.editTable.setTableData(AREA.stockinId, res.data[AREA.stockinId], false);
				} else {
					showNoQueryResultInfo();
					this.props.editTable.setTableData(AREA.stockinId, { rows: [] });
				}
			}
			// 按钮状态控制
			// buttonControl(props);
		}
	});
}
