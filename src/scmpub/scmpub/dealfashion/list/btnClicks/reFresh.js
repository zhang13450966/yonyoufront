/*
 * @Author: lichao 
 * @PageInfo:刷新   
 * @Date: 2019-03-12 16:04:58 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-07-10 15:57:35
 */
import { ajax } from 'nc-lightapp-front';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewController';
import { URL, AREACODE, BUTTONS, STATUS, PAGECODE } from '../../constance';

export default function reFresh(props) {
	ajax({
		url: URL.query,
		data: PAGECODE,
		method: 'post',
		success: (res) => {
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				let rows = [];
				if (res.data) rows = res.data[AREACODE].rows;
				props.editTable.setTableData(AREACODE, { rows });
				showRefreshInfo(); //刷新成功
				buttonController.call(this, props, STATUS.browse);
			}
		}
	});
}
