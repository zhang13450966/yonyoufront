/*
 * @Author: CongKe
 * @PageInfo: 页面预留功能 --展示分页信息
 * @Date: 2018-04-19 10:09:24
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-26 10:36:56
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
import { buttonController } from '../viewController';
export default function(props, config, pks) {
	// let _this = this;
	let data = {
		pks: pks,
		pageid: PAGECODE.listcode,
	};
	//得到数据渲染到页面
	ajax({
		url: URL.currentpage,
		data: data,
		success: res => {
			let { success, data } = res;
			if (success) {
				if (data) {
					this.props.table.setAllTableData(PAGECODE.tableId, data[PAGECODE.tableId]);
				} else {
					this.props.table.setAllTableData(PAGECODE.tableId, { rows: [] });
				}
				buttonController.initButtons.call(this, this.props, null);
			}
		},
	});
}
