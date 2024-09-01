/*
 * @Author: zhangchangqing
 * @PageInfo: 翻页按钮处理方法
 * @Date: 2018-05-24 11:30:54
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-02-25 13:26:44
 */

import { ajax } from 'nc-lightapp-front';
import { TARGETADJ_LIST } from '../../siconst';
import { buttonController } from '../viewControl';

export default function(props, config, pks) {
	let _this = this;
	let data = {
		pks: pks,
		pagecode: TARGETADJ_LIST.listpageid
	};
	//得到数据渲染到页面
	ajax({
		url: TARGETADJ_LIST.queryPageURL,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (data) {
					props.table.setAllTableData(TARGETADJ_LIST.formId, data[TARGETADJ_LIST.formId]);
				} else {
					props.table.setAllTableData(TARGETADJ_LIST.formId, { rows: [] });
				}
				buttonController.setListButtonVisiable.call(_this, props);
			}
		}
	});
}
