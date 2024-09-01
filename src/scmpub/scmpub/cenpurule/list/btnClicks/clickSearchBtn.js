/*
 * @Author: lichao 
 * @PageInfo: 查询  
 * @Date: 2019-03-12 16:08:27 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-28 16:31:04
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, AREACODE, BUTTONS, STATUS } from '../../constance';
import { setTableData } from 'scmpub/scmpub/components/VerticalEditTable';
import { viewController } from '../viewController';
import { showHasQueryResultInfo, showNoQueryResultInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickSearchBtn(props) {
	if (props.cardTable.getStatus(AREACODE.listHead) == STATUS.browse) {
		let queryInfo = props.search.getQueryInfo(AREACODE.search);
		queryInfo.pageCode = PAGECODE;
		ajax({
			url: URL.query,
			data: queryInfo,
			method: 'POST',
			success: (res) => {
				let { data } = res;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg, {
						[AREACODE.listHead]: 'cardTable',
						[AREACODE.listBody]: 'cardTable'
					});
				}
				setTableData.call(this, data, AREACODE.listHead, AREACODE.listBody);
				data && data.length > 0 ? showHasQueryResultInfo(data.length) : showNoQueryResultInfo();
				this.queryInfo = queryInfo;
				viewController.call(this, props, STATUS.browse);
			}
		});
	}
}
