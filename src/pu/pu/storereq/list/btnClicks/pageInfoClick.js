/*
 * @Author: zhangchangqing
 * @PageInfo: 翻页按钮处理方法
 * @Date: 2018-05-24 11:30:54
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-26 10:30:09
 */

import { ajax } from 'nc-lightapp-front';
import { STOREREQ_LIST } from '../../siconst';
import { buttonController } from '../viewControl';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';

export default function(props, config, pks) {
	let pageInfo = this.props.table.getTablePageInfo(STOREREQ_LIST.formId);
	///let searchVal = this.props.search.getAllSearchData(STOREREQ_LIST.searchId);
	let data = {
		pks: pks,
		pagecode: STOREREQ_LIST.listpageid,
	};
	//得到数据渲染到页面
	let _this = this;
	ajax({
		url: STOREREQ_LIST.queryPageURL,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (data) {
					props.table.setAllTableData(STOREREQ_LIST.formId, data[STOREREQ_LIST.formId]);
				} else {
					props.table.setAllTableData(STOREREQ_LIST.formId, { rows: [] });
				}
				buttonController.setListButtonVisiable.call(
					_this,
					_this.props,
					getDefData.call(_this, STOREREQ_LIST.dataSource, 'currentTab')
				);
			}
		},
	});
}
