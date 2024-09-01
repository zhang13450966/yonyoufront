/*
 * @Author: 王勇 
 * @PageInfo: 列表-操作列删除运输路线  
 * @Date: 2020-01-17 09:48:44 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:07:18
 */

import { ajax } from 'nc-lightapp-front';
import commonSearch from './commonSearch';
import { TEMPLATEINFO, REQUESTURL, VIEWINFO } from '../../const/index';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../../list/viewController/buttonController';

export default function innerDeleteBtnClick(props, record, index) {
	let id = record.crouteid.value;

	let pks = [ id ];
	let selIndex = [ index ];
	beSureBtnClick.call(this, props, pks, selIndex);
}
function beSureBtnClick(props, indexArr, selIndex) {
	let data = {
		pk_routes: indexArr,
		node: 'group'
	};
	ajax({
		url: REQUESTURL.delRouteUrl,
		data: data,
		success: (res) => {
			let { success } = res.data;
			if (success) {
				props.table.deleteTableRowsByIndex(TEMPLATEINFO.listAreaCode, selIndex, true);
				buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
				showSuccessInfo(getLangByResId(this, '4001ROUTE-000008')); /* 国际化处理： 删除成功*/
				commonSearch.call(this, props);
			}
		}
	});
}
