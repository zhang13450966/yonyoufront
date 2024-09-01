/*
 * @Author: xiahui 
 * @PageInfo: 匹配结果查询
 * @Date: 2019-06-22 11:29:05 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-07-04 15:57:40
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, FIELDS } from '../../constance';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonControl } from '../viewControl/buttonControl';

/**
 * 
 * @param {*} props 
 * @param {*} isRefresh 是否刷新
 */
export default function(props, isRefresh = false) {
	ajax({
		url: URL.matchQuery,
		data: this.invoicePks,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					this.pk_org.value = res.data[AREA.matchedId].rows[0].values[FIELDS.pk_org].value;
					this.pk_org.display = res.data[AREA.matchedId].rows[0].values[FIELDS.pk_org].display;
					props.editTable.setTableData(AREA.matchedId, res.data[AREA.matchedId], false);
				} else {
					props.editTable.setTableData(AREA.matchedId, { rows: [] });
				}
				isRefresh ? showRefreshInfo() : '';
				buttonControl.call(this, props);
			}
		}
	});
}
