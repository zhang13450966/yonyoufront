/*
 * @Author: qishy 
 * @PageInfo:列表分页查询
 * @Date: 2019-04-29 15:29:28 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-08 10:21:24
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, REQUESTURL } from '../../constance';
import { onSelected } from '../viewControl/rowSelectControl';

export default function(props, config, pks) {
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
				onSelected.call(this, props);
			}
		}
	});
}
