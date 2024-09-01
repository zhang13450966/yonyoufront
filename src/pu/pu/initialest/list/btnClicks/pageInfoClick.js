/*
 * @Author: zhaochyu
 * @PageInfo: 分页按钮处理
 * @Date: 2018-06-09 17:12:09
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-26 10:48:05
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { buttonController } from '../viewControl';
export default function(props, config, pks) {
	let _this = this;
	let pageInfo = this.props.table.getTablePageInfo(PAGECODE.tableId);
	//let searchVal = this.props.search.getAllSearchData(PAGECODE.searchId);
	let data = {
		pk: pks,
		pagecode: PAGECODE.listpagecode,
	};
	//得到数据渲染到页面
	ajax({
		url: URL.queryPage,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.table.setAllTableData(PAGECODE.tableId, data[PAGECODE.tableId]);
				} else {
					props.table.setAllTableData(PAGECODE.tableId, { rows: [] });
				}
				buttonController.lineSelected.call(_this, props, _this.state.currentTab);
			}
		},
	});
}
