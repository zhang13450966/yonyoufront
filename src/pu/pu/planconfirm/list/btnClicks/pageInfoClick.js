/*
 * @Author: hujieh 
 * @PageInfo: 进度确认单列表-翻页处理方法
 * @Date: 2019-04-02 14:38:43 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-02 11:45:39
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, AREA } from '../../constance';
import buttonController from '../viewController/buttonController';
export default function(props, config, pks) {
	let data = {
		pks: pks,
		pagecode: PAGECODE.list
	};

	ajax({
		url: URL.querypageURL,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.success) {
				if (res.data === undefined) {
					props.table.setAllTableData(AREA.head, { rows: [] });
				} else {
					let rowsData = { rows: [] };
					if (res.data && res.data[AREA.head] && res.data[AREA.head].rows) {
						rowsData = res.data[AREA.head];
					}
					props.table.setAllTableData(AREA.head, rowsData);
				}
				buttonController.call(this, this.props);
			}
		}
	});
}
