/*
 * @Author: yechd5 
 * @PageInfo: 复制时查询
 * @Date: 2018-08-21 20:17:58 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-18 16:06:53
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST } from '../../const';
import buttonController from '../viewController/buttonController';

export default function search(props, hid) {
	let data = { pks: [ hid ], pageid: PREPAIDINVOICE_CONST.cardPageId, userObject: {} };
	process.call(this, data);
}

function process(data) {
	ajax({
		url: PREPAIDINVOICE_CONST.copybillUrl,
		data: data,
		success: (res) => {
			if (res.data.head && res.data.body) {
				this.props.beforeUpdatePage();
				this.props.form.setAllFormValue({
					[PREPAIDINVOICE_CONST.formId]: res.data.head[PREPAIDINVOICE_CONST.formId]
				});
				this.props.cardTable.setTableData(
					PREPAIDINVOICE_CONST.tableId,
					res.data.body[PREPAIDINVOICE_CONST.tableId]
				);

				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBillCode: true,
					billCode: ''
				});

				buttonController.call(this, this.props);
				this.props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
			}
		}
	});
}
