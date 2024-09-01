/*
 * @Author: tianzhyw 
 * @PageInfo: 付款计划分页查询
 * @Date: 2022-01-26 17:21:27 
 * @Last Modified by: tianzhyw 
 * @Last Modified time: 2022-01-26 17:21:27 
 */

import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, STATUS } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';

export default function pageInfoQuery(props, pks) {
	let _this = this;
	let data = {
		pks: pks,
		pageid: PAGECODE.listcode //页面编码
	};
	ajax({
		url: URL.queryByPks,
		data: data,
		method: 'POST',
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					_this.props.editTable.setTableData(PAGECODE.tableId, data[PAGECODE.tableId]);
				} else {
					_this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
				}
				buttonController.togglePageShow.call(_this, props, STATUS.browse);
				toast({
					color: 'success',
					content: getLangByResId(_this, '4004OPAYPLAN-000010') /* 国际化处理： 查询成功！*/
				});
				buttonController.pageinfoinit.call(_this, props);
				// buttonController.onSelectButton.call(_this, props);
			}
		}
	});
}
