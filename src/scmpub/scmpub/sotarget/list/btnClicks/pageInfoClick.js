/*
 * @Author: zhangchangqing
 * @PageInfo: 翻页按钮处理方法
 * @Date: 2018-05-24 11:30:54
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 10:17:02
 */

import { ajax } from 'nc-lightapp-front';
import { TARGET_LIST } from '../../siconst';
import { buttonController } from '../viewControl';

export default function(props, config, pks) {
	let data = {
		pks: pks,
		pagecode: TARGET_LIST.listpageid
	};
	//得到数据渲染到页面
	ajax({
		url: TARGET_LIST.queryPageURL,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg);
				}
				if (data) {
					props.table.setAllTableData(TARGET_LIST.formId, data[TARGET_LIST.formId]);
				} else {
					props.table.setAllTableData(TARGET_LIST.formId, { rows: [] });
				}
				buttonController.setListButtonVisiable.call(this, props);
			}
		}
	});
}
