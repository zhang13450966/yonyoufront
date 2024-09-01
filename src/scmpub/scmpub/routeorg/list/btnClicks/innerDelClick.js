/*
 * @Author: 王勇 
 * @PageInfo: 列表-操作列删除运输路线  
 * @Date: 2020-01-17 09:48:44 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:39:03
 */

import { ajax } from 'nc-lightapp-front';
import commonSearch from './commonSearch';
import { TEMPLATEINFO, REQUESTURL, VIEWINFO } from '../../const/index';
import { showSuccessInfo, showWarningInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../../list/viewController/buttonController';

export default function innerDeleteBtnClick(props, record, index) {
	let id = record.crouteid.value;
	let pk_org = record.pk_org.value;
	let pk_group = record.pk_group.value;
	if (pk_org === pk_group) {
		showWarningInfo(getLangByResId(this, '4001ROUTE-000031')); /* 国际化处理：组织节点不能删除集团数据！*/
		return;
	}

	let pks = [ id ];
	let selIndex = [ index ];
	beSureBtnClick.call(this, props, pks, selIndex);
	// showDeleteDialog({
	// 	beSureBtnClick: beSureBtnClick.bind(this, props, pks,selIndex)
	// });
}
function beSureBtnClick(props, indexArr, selIndex) {
	let data = {
		pk_routes: indexArr,
		node: 'org'
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
