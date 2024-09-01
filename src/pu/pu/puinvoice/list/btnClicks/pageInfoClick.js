/*
 * @Author: jiangfw
 * @PageInfo: 列表页查询
 * @Date: 2018-05-07 08:35:41
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-26 10:35:22
 */
import { ajax } from 'nc-lightapp-front';
import { URL } from '../../constance/index';
import { btnController } from '../viewControl';

export default function(props, config, pks) {
	// let pageInfo = this.props.table.getTablePageInfo(this.tableId);
	// let searchVal = this.props.search.getAllSearchData(this.queryArea);
	let data = {
		pks: pks,
		pagecode: this.pageId,
	};
	//得到数据渲染到页面
	let _this = this;
	ajax({
		url: URL.pageQueryByPKs,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (data) {
					// 执行公式
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					props.table.setAllTableData(_this.tableId, data[_this.tableId]);
				} else {
					props.table.setAllTableData(_this.tableId, { rows: [] });
				}
				btnController.call(_this, props);
			}
		},
	});
}
