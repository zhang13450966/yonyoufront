/*
 * @Author: CongKe 
 * @PageInfo: 分页查询
 * @Date: 2019-04-17 09:16:21 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-04-22 09:17:59
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, URL } from '../../constance';

export default function(props, config, pks) {
	let data = {
		pks: pks,
		pagecode: PAGECODE.LISTPAGECODE
	};

	ajax({
		url: URL.pageQueryByPks,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg); //参数一：返回的公式对象
			}
			if (success) {
				if (data) {
					props.table.setAllTableData(AREA.listTableId, data[AREA.listTableId]);
				} else {
					props.table.setAllTableData(AREA.listTableId, { rows: [] });
				}
			}
		}
	});
}
