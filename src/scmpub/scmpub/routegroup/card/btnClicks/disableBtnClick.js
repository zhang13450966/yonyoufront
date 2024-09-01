/*
 * @Author: 王勇 
 * @PageInfo: 卡片-停用运输路线  
 * @Date: 2020-01-17 09:36:16 
 * @Last Modified by: jiangzls
 * @Last Modified time: 2020-12-29 15:03:31
 */

import { ajax } from 'nc-lightapp-front';
import { CARDTEMPLATEINFO, ROUTEVOINFO, REQUESTURL, CARDBUTTONINFO } from '../../const/index';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningDialog } from '../../../pub/tool/messageUtil';
export default function disableBtnClick(props) {
	const title = getLangByResId(this, '4001ROUTE-000037'); /**停用 */
	const content = getLangByResId(this, '4001ROUTE-000038'); /**停用所选数据？ */

	showWarningDialog(title, content, {
		beSureBtnClick: beSureBtnClick.bind(this, props)
	});
}

function beSureBtnClick(props) {
	let pks = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.crouteid).value;
	let data = {
		pk_routes: pks,
		node: 'group',
		enable: 'false'
	};

	ajax({
		url: REQUESTURL.enableChangeRouteUrl,
		data: data,
		success: (res) => {
			showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000018')); /* 停用成功！*/
			props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
				[ROUTEVOINFO.bsealflag]: {
					value: true,
					display: null
				}
			});
			props.button.setButtonsVisible(CARDBUTTONINFO.disableBtnCode, false);
			props.button.setButtonsVisible(CARDBUTTONINFO.enableBtnCode, true);
			props.button.setDisabled(CARDBUTTONINFO.disableBtnCode, true);
			props.button.setDisabled(CARDBUTTONINFO.enableBtnCode, false);
		}
	});
}
