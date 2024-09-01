/*
 * @Author: CongKe
 * @PageInfo: 分页信息
 * @Date: 2018-04-19 10:09:24
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-26 10:24:29
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';
import buttonController from '../viewController/buttonController';

export default function(props, config, pks) {
	let _this = this;
	let data = {
		pks: pks,
		pageid: PAGECODE.listcode,
	};
	//得到数据渲染到页面
	ajax({
		url: URL.currentpage,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (data) {
					_this.props.table.setAllTableData(PAGECODE.list_head, data[PAGECODE.list_head]);
				} else {
					_this.props.table.setAllTableData(PAGECODE.list_head, { rows: [] });
				}
				buttonController.onSelectedButtons.call(_this);
			}
		},
	});
}
