/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义查询
 * @Date: 2020-02-17 11:53:31
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-17 14:02:50
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA, FILED, PAGEID, CARRIERDATASOURCE } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { lineSelected } from '../viewController/buttonController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function commonSearch(queryInfo, isRefresh = false, isToast = true) {
	let checked = this.state.checked;
	let userobject = {};
	userobject.checked = checked;
	let pageInfo = this.props.table.getTablePageInfo(AREA.serchArea); //分页信息
	if (queryInfo != undefined && queryInfo != null) {
		this.props.button.setButtonDisabled(FILED.Refresh, false);
	}
	queryInfo = queryInfo || {};
	if (queryInfo.querycondition) {
		setDefData(CARRIERDATASOURCE.carrierdatasource, 'queryInfo', queryInfo);
		queryInfo.pageInfo = pageInfo;
		let data = {
			queryInfo: queryInfo,
			pageCode: PAGEID.listpagecodegroup,
			userobj: userobject
		};
		ajax({
			method: 'POST',
			url: URL.query,
			data: data,
			success: (res) => {
				if (res && res.data) {
					this.props.table.setAllTableData(AREA.listTable, res.data.list_head);
					lineSelected.call(this, this.props);
					if (isRefresh) {
						showSuccessInfo(getLangByResId(this, '4001CARRIERGROUP-000016')); /* 国际化处理： 刷新成功！*/
					} else {
						if (isToast) {
							showSuccessInfo(getLangByResId(this, '4001CARRIERGROUP-000017')); /* 国际化处理： 查询成功!*/
						}
					}
				} else if (!res.data) {
					this.props.table.setAllTableData(AREA.listTable, { rows: [] });
					if (isRefresh) {
						showSuccessInfo(getLangByResId(this, '4001CARRIERGROUP-000016')); /* 国际化处理： 刷新成功！*/
					} else {
						if (isToast) {
							showSuccessInfo(getLangByResId(this, '4001CARRIERGROUP-000017')); /* 国际化处理： 查询成功!*/
						}
					}
				}
			}
		});
	}
}
