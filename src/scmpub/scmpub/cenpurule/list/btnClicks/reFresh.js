/*
 * @Author: lichao 
 * @PageInfo:刷新   
 * @Date: 2019-03-12 16:09:45 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-28 16:31:37
 */
import { ajax } from 'nc-lightapp-front';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, AREACODE, BUTTONS } from '../../constance';
import { setTableData } from 'scmpub/scmpub/components/VerticalEditTable';

export default function reFresh(props) {
	if (!this.queryInfo) {
		showRefreshInfo(); //刷新成功
		return;
	}
	ajax({
		url: URL.query,
		data: this.queryInfo,
		method: 'post',
		success: (res) => {
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg, {
						[AREACODE.listHead]: 'cardTable',
						[AREACODE.listBody]: 'cardTable'
					});
				}
				setTableData.call(this, res.data, AREACODE.listHead, AREACODE.listBody);
				showRefreshInfo(); //刷新成功
				props.button.setButtonDisabled([ BUTTONS.Print, BUTTONS.Delete, BUTTONS.Output ], true);
			}
		}
	});
}
