/*
 * @Author: xiahui 
 * @PageInfo: 分页查询
 * @Date: 2019-04-11 14:08:58 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-07-25 18:54:50
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, URL } from '../../constance';
import { buttonControl } from '../viewControl/buttonControl';

export default function(props, config, pks) {
	let data = {
		pks: pks,
		pagecode: PAGECODE.listPagecode
	};

	ajax({
		url: URL.pageQuery,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (success) {
				if (data) {
					props.table.setAllTableData(AREA.listTableId, data[AREA.listTableId]);
				} else {
					props.table.setAllTableData(AREA.listTableId, { rows: [] });
				}
				buttonControl.call(this, props);
			}
		}
	});
}
