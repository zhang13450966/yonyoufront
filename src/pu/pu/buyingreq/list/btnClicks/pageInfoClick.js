/*
 * @Author: zhangchangqing
 * @PageInfo: 翻页按钮处理方法
 * @Date: 2018-05-24 11:30:54
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-26 11:00:43
 */

import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST } from '../../siconst';
import { buttonController } from '../viewControl';

export default function(props, config, pks) {
	//let pageInfo = this.props.table.getTablePageInfo(BUYINGREQ_LIST.formId);
	//let searchVal = this.props.search.getAllSearchData(BUYINGREQ_LIST.searchId);
	let _this = this;
	let data = {
		pks: pks,
		pagecode: BUYINGREQ_LIST.listpageid,
	};
	//得到数据渲染到页面
	ajax({
		url: BUYINGREQ_LIST.queryPageURL,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (data) {
					props.table.setAllTableData(BUYINGREQ_LIST.formId, data[BUYINGREQ_LIST.formId]);
				} else {
					props.table.setAllTableData(BUYINGREQ_LIST.formId, { rows: [] });
				}
				buttonController.setListButtonVisiable.call(_this, props);
			}
		},
	});
}
