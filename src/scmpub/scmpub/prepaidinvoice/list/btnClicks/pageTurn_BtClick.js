/*
 * @Author: 刘奇 
 * @PageInfo: 翻页按钮处理方法
 * @Date: 2019-03-27 09:06:27 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-07-26 11:15:50
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST } from '../../const';
import { buttonControl } from '../viewController/buttonController';

export default function(props, config, pks) {
	let data = {
		pks: pks,
		pageid: PREPAIDINVOICE_CONST.listPageId
	};
	//得到数据渲染到页面

	ajax({
		url: PREPAIDINVOICE_CONST.queryForPage,
		data: data,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data && data.head) {
					props.table.setAllTableData(PREPAIDINVOICE_CONST.formId, data.head);
				} else {
					props.table.setAllTableData(PREPAIDINVOICE_CONST.formId, { rows: [] });
				}
				buttonControl.call(this, this.props);
			}
		}
	});
}
