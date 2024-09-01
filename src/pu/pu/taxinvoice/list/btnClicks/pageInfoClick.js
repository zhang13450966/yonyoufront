/*
 * @Author: chaiwx 
 * @PageInfo: 分页查询
 * @Date: 2018-05-07 08:35:41 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-08 14:37:43
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, REQUESTURL } from '../../constance';
import { onSelected } from '../viewControl/rowSelectControl';

export default function(props, config, pks) {
	let _this = this;
	let data = {
		pks: pks,
		pageid: PAGECODE.listPagecode
	};

	ajax({
		url: REQUESTURL.pageQuery,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.table.setAllTableData(AREA.listTableId, data[AREA.listTableId]);
				} else {
					props.table.setAllTableData(AREA.listTableId, { pageInfo: {}, rows: [] });
				}
				onSelected.call(_this, props);
			}
		}
	});
}
